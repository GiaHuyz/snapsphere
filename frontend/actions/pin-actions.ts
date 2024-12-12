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
	link: string
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
		revalidateTag('board')
		return res
	} catch (error) {
		return { error: getErrorMessage(error) }
	}
})

export const getAllPinsUserAction = createServerAction<void, Pin[]>(async () => {
	try {
		const res = await HttpRequest.get<Pin[]>('/pins')
		return res
	} catch (error) {
		return { error: getErrorMessage(error) }
	}
})

export const createPin = createServerAction<FormData, Pin>(async (data: FormData) => {
	try {
		const res = await HttpRequest.post<Pin>('/pins', data)
		return res
	} catch (error) {
		return { error: getErrorMessage(error) }
	}
})
