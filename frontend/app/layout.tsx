import { Board, getBoardsByUsernameAction } from '@/actions/board-actions'
import Header from '@/components/header'
import { isActionError } from '@/lib/errors'
import { BoardDropdownProvider } from '@/provider/board-dropdown-provider'
import ModalProvider from '@/provider/modal-provider'
import { ThemeProvider } from '@/provider/theme-provider'
import { UserProvider } from '@/provider/user-provider'
import { ClerkProvider } from '@clerk/nextjs'
import { clerkClient, currentUser } from '@clerk/nextjs/server'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Toaster } from 'sonner'
import './globals.css'

const geistSans = localFont({
	src: './fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 900'
})
const geistMono = localFont({
	src: './fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	weight: '100 900'
})

export const metadata: Metadata = {
	title: 'Snapsphere',
	description: 'SnapSphere - AI-powered image sharing platform'
}

export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	const user = await currentUser()
	let boards: Board[] = []

	if (user) {
		if (!user.username) {
			let username = user.emailAddresses[0].emailAddress.split('@')[0]

			if (/^\d+$/.test(username)) {
				username = 'user_' + username
			}

			;(await clerkClient()).users.updateUser(user.id, { username })
		}

		const res = await getBoardsByUsernameAction(user.id)

		if (!isActionError(res)) {
			boards = res
		}
	}

	return (
		<ClerkProvider>
			<html lang="en" suppressHydrationWarning>
				<UserProvider user={JSON.parse(JSON.stringify(user))} isSignedIn={!!user}>
					<BoardDropdownProvider boardsDropdown={boards}>
						<body className={`${geistSans.variable} ${geistMono.variable} antialiased}`}>
							<ThemeProvider
								attribute="class"
								defaultTheme="system"
								enableSystem
								disableTransitionOnChange
							>
								<Header user={JSON.parse(JSON.stringify(user))} />
								<main>{children}</main>
								<ModalProvider />
								<Toaster position="top-center" richColors duration={3000} />
							</ThemeProvider>
						</body>
					</BoardDropdownProvider>
				</UserProvider>
			</html>
		</ClerkProvider>
	)
}
