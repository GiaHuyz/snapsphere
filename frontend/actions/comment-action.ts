'use server'

import { PAGE_SIZE_COMMENTS } from '@/lib/constants'
import createServerAction from '@/lib/create-server-action'
import { getErrorMessage } from '@/lib/errors'
import { HttpRequest } from '@/lib/http-request'

export interface IComment {
	_id: string
	user_id: string
	pin_id: string
	content: string
	image?: string
    replyCount: number
    likeCount: number
	likes: number
	user: {
		username: string
		fullName: string
		imageUrl: string
	}
    isLiked: boolean
    createdAt: string
}

interface QueryParams {
    pin_id: string
    parent_id?: string | null
    page?: number
    pageSize?: number
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
        if(!queryParams.parent_id) {
            queryParams.parent_id = null
        }

        queryParams.page = queryParams.page || 1
        queryParams.pageSize = queryParams.pageSize || PAGE_SIZE_COMMENTS

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

export const deleteCommentAction = createServerAction<string, void>(async (id) => {
    try {
        await HttpRequest.delete(`/comments/${id}`)
    } catch (error) {
        return { error: getErrorMessage(error) }
    }
})
