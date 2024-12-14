'use server'

import createServerAction from '@/lib/create-server-action'
import { getErrorMessage } from '@/lib/errors'
import { HttpRequest } from '@/lib/http-request'
import { revalidateTag } from 'next/cache'

export interface Pin {
	_id: string
	userId: string
	url: string
	title: string
	description: string
	referenceLink: string
	isAllowedComment: boolean
	createdAt: Date
	updatedAt: Date
}

interface SavePinDto {
	pinId: string
	boardId: string
}

export const savePinToBoardAction = createServerAction<SavePinDto, Pin>(async (data) => {
	try {
		const res = await HttpRequest.post<Pin>('/pins/save-to-board', data)
		revalidateTag('boards')
		return res
	} catch (error) {
		return { error: getErrorMessage(error) }
	}
})

export const getAllPinsUserAction = createServerAction<string, Pin[]>(
	async (userId) => {
		try {
			const res = await HttpRequest.get<Pin[]>(`/pins/users/${userId}`, { next: { tags: ['pins'] } })
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
		revalidateTag('boards')
		revalidateTag('pins')
	} catch (error) {
		return { error: getErrorMessage(error) }
	}
})
