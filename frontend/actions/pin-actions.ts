'use server'

import { PAGE_SIZE_PINS } from '@/lib/constants'
import createServerAction from '@/lib/create-server-action'
import { getErrorMessage } from '@/lib/errors'
import { HttpRequest } from '@/lib/http-request'

export interface Pin {
	_id: string
	user_id: string
	url: string
	title: string
	description: string
	referenceLink: string
	isAllowedComment: boolean
	secret: boolean
	saveCount: number
	likeCount: number
	commentCount: number
	board_pin_id: string
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

interface QueryParamsBoardPin {
	board_id: string
	pin_id?: string
	user_id?: string
	page?: number
	pageSize?: number
	sort?: string
}

type EditPinData = Partial<Pick<Pin, '_id' | 'title' | 'description' | 'referenceLink' | 'isAllowedComment'>>

export const savePinToBoardAction = createServerAction<SavePinDto, Pin>(async (data) => {
	try {
		const res = await HttpRequest.post<Pin>('/board-pin', data)
		return res
	} catch (error) {
		return { error: getErrorMessage(error) }
	}
})

export const getAllPinsUserAction = createServerAction<QueryParams, Pin[]>(
	async (queryParams) => {
		try {
			queryParams.page = queryParams.page || 1
			queryParams.pageSize = queryParams.pageSize || PAGE_SIZE_PINS

			const queryString = Object.entries(queryParams)
				.filter(([, value]) => value !== undefined)
				.map(([key, value]) => `${key}=${value}`)
				.join('&')
			const res = await HttpRequest.get<Pin[]>(`/pins?${queryString}`)
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
	} catch (error) {
		return { error: getErrorMessage(error) }
	}
})

export const deletePinFromBoardAction = createServerAction<string, void>(async (id) => {
	try {
		await HttpRequest.delete(`/board-pin/${id}`)
	} catch (error) {
		return { error: getErrorMessage(error) }
	}
})

export const editPinAction = createServerAction<EditPinData, Pin>(async (data) => {
	try {
		const { _id, ...updateData } = data
		const res = await HttpRequest.patch<Pin>(`/pins/${_id}`, updateData)
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

export const getPinsByBoardIdAction = createServerAction<QueryParamsBoardPin, Pin[]>(async (data) => {
	try {
		data.page = data.page || 1
		data.pageSize = data.pageSize || PAGE_SIZE_PINS

		const queryString = Object.entries(data)
			.filter(([, value]) => value !== undefined)
			.map(([key, value]) => `${key}=${value}`)
			.join('&')

		const res = await HttpRequest.get<{ _id: string, pin: Pin }[]>(`/board-pin?${queryString}`)

		return res.filter(({ pin }) => pin).map(({ _id, pin }) => {
            return {
                ...pin,
                board_pin_id: _id
            }
        })
	} catch (error) {
		return { error: getErrorMessage(error) }
	}
})
