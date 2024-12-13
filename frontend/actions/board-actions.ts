'use server'

import { createBoardData } from '@/components/modals/create-board-modal'
import { EditBoardData } from '@/components/modals/edit-board-modal'
import createServerAction from '@/lib/create-server-action'
import { getErrorMessage } from '@/lib/errors'
import { HttpRequest } from '@/lib/http-request'

export interface Board {
	_id: string
	title: string
	description: string
	secret: boolean
	pinCount: number
	createdAt: string
	coverImages: {
		pin_id: string
		url: string
	}[]
}

export const createBoardAction = createServerAction<createBoardData, Board>(async (data) => {
	try {
		const newBoard = await HttpRequest.post<Board>('/boards', data)
		return newBoard
	} catch (error) {
		return { error: getErrorMessage(error) }
	}
})

export const editBoardAction = createServerAction<EditBoardData, Board>(async (data, boardId) => {
	try {
		const updatedBoard = await HttpRequest.patch<Board>(`/boards/${boardId}`, data)
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

export const getBoardsByUsernameAction = createServerAction<string, Board[]>(
	async (userId) => {
		try {
			const boards = await HttpRequest.get<Board[]>(`/boards/user/${userId}`, {
				cache: 'force-cache',
				next: { tags: ['boards'] }
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
