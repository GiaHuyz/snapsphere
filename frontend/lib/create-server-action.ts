/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from '@clerk/nextjs/server'
import { ServerActionResponse } from './errors'

interface ServerActionOptions {
	requireAuth?: boolean
    isAdmin?: boolean
}

export default function createServerAction<T, R>(
	handler: (data: T, ...args: any) => Promise<ServerActionResponse<R>>,
	options: ServerActionOptions = { requireAuth: true, isAdmin: false }    
) {
	return async (data: T, ...args: any) => {
		if (options.requireAuth) {
			const { userId } = await auth()
			if (!userId) {
				throw new Error('Unauthorized')
			}
		}

        if (options.isAdmin) {
            const { sessionClaims } = await auth()
            if (sessionClaims?.metadata.role !== 'admin') {
                throw new Error('Unauthorized')
            }
        }

		return handler(data, ...args)
	}
}
