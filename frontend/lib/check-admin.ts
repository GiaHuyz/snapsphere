import { auth } from '@clerk/nextjs/server'

export const isAdmin = async () => {
	const { sessionClaims } = await auth()
	return sessionClaims?.metadata.role === 'admin'
}
