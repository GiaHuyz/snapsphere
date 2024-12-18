import Header from '@/components/header'
import getCurrentUser from '@/lib/get-current-user'
import ModalProvider from '@/provider/modal-provider'
import ProgressBarProvider from '@/provider/progress-bar-provider'
import { ThemeProvider } from '@/provider/theme-provider'
import { ClerkProvider } from '@clerk/nextjs'
import { clerkClient } from '@clerk/nextjs/server'
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
	const user = await getCurrentUser()

	if (user) {
		if (!user.username) {
			let username = user.emailAddresses[0].emailAddress.split('@')[0]

			// replace all non-alphanumeric characters with empty string
			username = username.replace(/[^a-zA-Z0-9]/g, '')

			if (/^\d+$/.test(username)) {
				username = 'user_' + username
			}

			;(await clerkClient()).users.updateUser(user.id, { username })
		}
	}

	return (
		<ClerkProvider>
			<html lang="en" suppressHydrationWarning>
				<body className={`${geistSans.variable} ${geistMono.variable} antialiased}`}>
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
						<ProgressBarProvider>
							<Header user={JSON.parse(JSON.stringify(user))} />
							<main>{children}</main>
							<ModalProvider />
							<Toaster position="top-center" richColors duration={3000} />
						</ProgressBarProvider>
					</ThemeProvider>
				</body>
			</html>
		</ClerkProvider>
	)
}
