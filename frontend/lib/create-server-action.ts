/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from '@clerk/nextjs/server'
import { ServerActionResponse } from './errors'

interface ServerActionOptions {
	requireAuth?: boolean
}

export default function createServerAction<T, R>(
	handler: (data: T, ...args: any) => Promise<ServerActionResponse<R>>,
	options: ServerActionOptions = { requireAuth: true }
) {
	return async (data: T, ...args: any) => {
		if (options.requireAuth) {
			const { userId } = await auth()
			if (!userId) {
				throw new Error('Unauthorized')
			}
		}

		return handler(data, ...args)
	}
}
