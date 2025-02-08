import ProgressBarProvider from '@/provider/progress-bar-provider'
import { ThemeProvider } from '@/provider/theme-provider'
import { ClerkProvider } from '@clerk/nextjs'
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
	return (
		<ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
			<html lang="en" suppressHydrationWarning>
				<body className={`${geistSans.variable} ${geistMono.variable} antialiased}`}>
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
						<ProgressBarProvider>
							{children}
							<Toaster position="top-center" richColors duration={3000} />
						</ProgressBarProvider>
					</ThemeProvider>
				</body>
			</html>
		</ClerkProvider>
	)
}
