import { getBoards } from '@/actions/board-actions'
import Header from '@/components/header'
import { Toaster } from '@/components/ui/toaster'
import { BoardProvider } from '@/provider/board-provider'
import { ModalProvider } from '@/provider/modal-provider'
import { ThemeProvider } from '@/provider/theme-provider'
import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
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
	const boards = await getBoards()
	return (
		<ClerkProvider>
			<html lang="en" suppressHydrationWarning>
				<BoardProvider boardPreviews={boards} boardsDropdown={boards}>
					<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
						<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
							<Header />
							<main>{children}</main>
							<ModalProvider />
							<Toaster />
						</ThemeProvider>
					</body>
				</BoardProvider>
			</html>
		</ClerkProvider>
	)
}
