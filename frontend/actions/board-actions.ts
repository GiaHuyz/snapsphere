'use server'

import { createBoardData } from '@/components/modals/create-board-modal'
import createServerAction from '@/lib/create-server-action'
import { getErrorMessage } from '@/lib/errors'
import { HttpRequest } from '@/lib/http-request'
import { revalidateTag } from 'next/cache'

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
		revalidateTag('boards')
		return newBoard
	} catch (error) {
		return { error: getErrorMessage(error) }
	}
})

export const editBoardAction = createServerAction<EditBoardData, Board>(async (data) => {
	try {
		const { _id, ...rest } = data
		const updatedBoard = await HttpRequest.patch<Board>(`/boards/${_id}`, rest)
		revalidateTag('boards')
		return updatedBoard
	} catch (error) {
		return { error: getErrorMessage(error) }
	}
})

export const deleteBoardAction = createServerAction<string, void>(async (id) => {
	try {
		await HttpRequest.delete(`/boards/${id}`)
		revalidateTag('boards')
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
            const queryString = Object.entries(queryParams)
                .filter(([, value]) => value !== undefined)
                .map(([key, value]) => `${key}=${value}`)
                .join('&')

			const boards = await HttpRequest.get<Board[]>(`/boards?${queryString}`, {
				cache: 'force-cache',
				next: {
					tags: ['boards']
				}
			})
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
