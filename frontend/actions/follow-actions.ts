'use server'

import createServerAction from '@/lib/create-server-action'
import { getErrorMessage } from '@/lib/errors'
import { HttpRequest } from '@/lib/http-request'

interface CheckFollows {
	followerId: string
	followingId: string
}

export interface Follows {
	id: string
	user: {
		id: string
		username: string
		fullName: string
		imageUrl: string
	}
	isFollowing: boolean
}

interface QueryParams {
	page?: number
	pageSize?: number
	followerId?: string
	followingId?: string
}

interface FollowData {
	followingId: string
}

export const getAllFollowsAction = createServerAction<QueryParams, Follows[]>(
	async (data) => {
		try {
			if ((data.followerId && data.followingId) || (!data.followerId && !data.followingId)) {
				throw new Error('At least one of followerId or followingId must be provided')
			}

			let queryString = ''

			if (data.followerId) {
				queryString += `follower_id=${data.followerId}`
			} else {
				queryString += `following_id=${data.followingId}`
			}

            queryString += `&page=${data.page || 1}&pageSize=${data.pageSize || 10}`

			const res = await HttpRequest.get<Follows[]>(`/follows?${queryString}`, {
				cache: 'force-cache'
			})
			return res
		} catch (error) {
			return { error: getErrorMessage(error) }
		}
	},
	{ requireAuth: false }
)

export const checkFollowAction = createServerAction<QueryParams, CheckFollows>(async (data) => {
	try {
		const res = await HttpRequest.get<CheckFollows[]>(
			`/follows?follower_id=${data.followerId}&following_id=${data.followingId}`
		)
		return res[0]
	} catch (error) {
		return { error: getErrorMessage(error) }
	}
})

export const followUserAction = createServerAction<FollowData, void>(async (data) => {
	try {
		await HttpRequest.post(`/follows/${data.followingId}`)
	} catch (error) {
		return { error: getErrorMessage(error) }
	}
})

export const unfollowUserAction = createServerAction<FollowData, void>(async (data) => {
	try {
		await HttpRequest.delete(`/follows/${data.followingId}`)
	} catch (error) {
		return { error: getErrorMessage(error) }
	}
})
