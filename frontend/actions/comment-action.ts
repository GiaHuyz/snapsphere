'use server'

import createServerAction from '@/lib/create-server-action'
import { getErrorMessage } from '@/lib/errors'
import { HttpRequest } from '@/lib/http-request'

export interface IComment {
	_id: string
	user_id: string
	pin_id: string
	content: string
	image?: string
	likes: number
	user: {
		username: string
		fullName: string
		imageUrl: string
	}
}

interface QueryParams {
    pin_id: string
    page: number
    pageSize: number
}

export const createCommentAction = createServerAction<FormData, IComment>(async (data) => {
	try {
		const res = await HttpRequest.post<IComment>('/comments', data)
		return res
	} catch (error) {
		return { error: getErrorMessage(error) }
	}
})

export const getCommentsAction = createServerAction<QueryParams, IComment[]>(async (queryParams) => {
	try {
		const queryString = Object.entries(queryParams)
			.filter(([, value]) => value !== undefined)
			.map(([key, value]) => `${key}=${value}`)
			.join('&')

		const res = await HttpRequest.get<IComment[]>(`/comments?${queryString}`, {
			cache: 'force-cache',
			next: {
				tags: ['comments']
			}
		})
		return res
	} catch (error) {
		return { error: getErrorMessage(error) }
	}
}, { requireAuth: false })
