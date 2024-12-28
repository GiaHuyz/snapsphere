import Header from '@/components/header'
import getCurrentUser from '@/lib/get-current-user'
import ModalProvider from '@/provider/modal-provider'
import { clerkClient } from '@clerk/nextjs/server'

export default async function UserLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	const user = await getCurrentUser()

	if (user) {
		if (!user.username) {
			let username = user.emailAddresses[0].emailAddress.split('@')[0]

			// replace all non-alphanumeric characters with empty string
			username = username.replace(/[^a-zA-Z0-9]/g, '')

			if (/^\d+$/.test(username)) {
				username = 'user_' + username
			}

			;(await clerkClient()).users.updateUser(user.id, {
				username,
				unsafeMetadata: {
					followerCount: 0,
					followingCount: 0,
					bio: '',
					website: ''
				}
			})
		}
	}

	return (
		<>
			<Header user={JSON.parse(JSON.stringify(user))} />
			<main>{children}</main>
			<ModalProvider />
		</>
	)
}
