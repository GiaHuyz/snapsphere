'use server'

import { createBoardData } from '@/components/modals/create-board-modal'
import { PAGE_SIZE_BOARDS } from '@/lib/constants'
import createServerAction from '@/lib/create-server-action'
import { getErrorMessage } from '@/lib/errors'
import { HttpRequest } from '@/lib/http-request'

export interface Board {
	_id: string
    user_id: string
	title: string
	description: string
	secret: boolean
	pinCount: number
	createdAt: string
	coverImages: {
		_id: string
		url: string
	}[]
}

interface EditBoardData {
	_id: string
	title?: string
	description?: string
	secret?: boolean
	coverImageIds?: string[]
}

export const createBoardAction = createServerAction<createBoardData, Board>(async (data) => {
	try {
		const newBoard = await HttpRequest.post<Board>('/boards', data)
		return newBoard
	} catch (error) {
		return { error: getErrorMessage(error) }
	}
})

export const editBoardAction = createServerAction<EditBoardData, Board>(async (data) => {
	try {
		const { _id, ...rest } = data
		const updatedBoard = await HttpRequest.patch<Board>(`/boards/${_id}`, rest)
		return updatedBoard
	} catch (error) {
		return { error: getErrorMessage(error) }
	}
})

export const deleteBoardAction = createServerAction<string, void>(async (id) => {
	try {
		await HttpRequest.delete(`/boards/${id}`)
	} catch (error) {
		return { error: getErrorMessage(error) }
	}
})

interface QueryParams {
    user_id?: string
    title?: string
    page?: number
    pageSize?: number
    sort?: string
}

export const getBoardsAction = createServerAction<QueryParams, Board[]>(
	async (queryParams) => {
		try {
            queryParams.page = queryParams.page || 1
            queryParams.pageSize = queryParams.pageSize || PAGE_SIZE_BOARDS

            const queryString = Object.entries(queryParams)
                .filter(([, value]) => value !== undefined)
                .map(([key, value]) => `${key}=${value}`)
                .join('&')

			const boards = await HttpRequest.get<Board[]>(`/boards?${queryString}`)
			return boards
		} catch (error) {
			if (error instanceof Error && error.message === 'Unauthorized') {
				return []
			}
			return { error: getErrorMessage(error) }
		}
	},
	{ requireAuth: false }
)
