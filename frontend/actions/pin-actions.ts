'use server'

import createServerAction from '@/lib/create-server-action'
import { getErrorMessage } from '@/lib/errors'
import { HttpRequest } from '@/lib/http-request'
import { revalidateTag } from 'next/cache'

export interface Pin {
	_id: string
	user_id: string
	url: string
	title: string
	description: string
	referenceLink: string
	isAllowedComment: boolean
	createdAt: Date
	updatedAt: Date
}

interface SavePinDto {
	pin_id: string
	board_id: string
}

interface QueryParams {
	user_id?: string
	title?: string
	page?: number
	pageSize?: number
	sort?: string
}

type EditPinData = Partial<Pick<Pin, '_id' | 'title' | 'description' | 'referenceLink' | 'isAllowedComment'>>

export const savePinToBoardAction = createServerAction<SavePinDto, Pin>(async (data) => {
	try {
		const res = await HttpRequest.post<Pin>('/board-pin', data)
		revalidateTag('boards')
		return res
	} catch (error) {
		return { error: getErrorMessage(error) }
	}
})

export const getAllPinsUserAction = createServerAction<QueryParams, Pin[]>(
	async (queryParams) => {
		try {
			const queryString = Object.entries(queryParams)
				.filter(([, value]) => value !== undefined)
				.map(([key, value]) => `${key}=${value}`)
				.join('&')
			const res = await HttpRequest.get<Pin[]>(`/pins?${queryString}`, {
				cache: 'force-cache',
				next: { tags: ['pins'] }
			})
			return res
		} catch (error) {
			return { error: getErrorMessage(error) }
		}
	},
	{ requireAuth: false }
)

export const createPin = createServerAction<FormData, Pin>(async (data: FormData) => {
	try {
		const res = await HttpRequest.post<Pin>('/pins', data)
		return res
	} catch (error) {
		return { error: getErrorMessage(error) }
	}
})

export const deletePinAction = createServerAction<string, void>(async (id) => {
	try {
		await HttpRequest.delete(`/pins/${id}`)
		revalidateTag('pins')
	} catch (error) {
		return { error: getErrorMessage(error) }
	}
})

export const editPinAction = createServerAction<EditPinData, Pin>(async (data) => {
	try {
		const { _id, ...updateData } = data
		const res = await HttpRequest.patch<Pin>(`/pins/${_id}`, updateData)
		revalidateTag('pins')
		return res
	} catch (error) {
		return { error: getErrorMessage(error) }
	}
})

export const getPinDetailAction = createServerAction<string, Pin>(async (id) => {
	try {
		const res = await HttpRequest.get<Pin>(`/pins/${id}`, {
			cache: 'force-cache'
		})
		return res
	} catch (error) {
		return { error: getErrorMessage(error) }
	}
})

export const getPinsByBoardIdAction = createServerAction(async (boardId: string) => {
	try {
		const pins = await HttpRequest.get<Pin[]>(`/board-pin?board_id=${boardId}`, {
			cache: 'force-cache'
		})
		return pins
	} catch (error) {
		console.error('Error fetching pins:', error)
		return []
	}
})
