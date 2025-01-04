'use server'

import { PAGE_SIZE_USERS_LIKES } from '@/lib/constants'
import createServerAction from '@/lib/create-server-action'
import { getErrorMessage } from '@/lib/errors'
import { HttpRequest } from '@/lib/http-request'
import { User } from '@clerk/nextjs/server'

export interface LikeData {
	item_id: string
	type: 'pin' | 'comment'
}

export const likeAction = createServerAction(async (data: LikeData) => {
	try {
		const res = await HttpRequest.post('/likes', data)
		return res
	} catch (error) {
		return { error: getErrorMessage(error) }
	}
})

export const unlikeAction = createServerAction(async (id: string) => {
	try {
		const res = await HttpRequest.delete(`/likes/item/${id}`)
		return res
	} catch (error) {
		return { error: getErrorMessage(error) }
	}
})

export const getUsersLikedPinAction = createServerAction(
	async ({
		pinId,
		page = 1,
		pageSize = PAGE_SIZE_USERS_LIKES
	}: {
		pinId: string
		page?: number
		pageSize?: number
	}) => {
		try {
			const res = await HttpRequest.get<User[]>(`/likes/${pinId}/users/?page=${page}&pageSize=${pageSize}`)
			return res
		} catch (error) {
			return { error: getErrorMessage(error) }
		}
	}
)
