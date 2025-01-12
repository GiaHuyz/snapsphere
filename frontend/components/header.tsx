'use client'

import ModeToggle from '@/components/mode-toggle'
import { SearchBar } from '@/components/seach-bar'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { User } from '@clerk/nextjs/server'
import { LayoutDashboard, UserRoundPen } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function Header({ user }: { user: User }) {
	const isSignedIn = !!user
	const pathname = usePathname()
	const router = useRouter()

	return (
		<div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-[80px] items-center mx-auto p-5">
				<div className="flex items-center space-x-4">
					<Link href="/" className="flex items-center space-x-2 p-2 rounded-full hover:bg-slate-300">
						<Image src="/logo.png" alt="logo" width={24} height={24} />
					</Link>
					{isSignedIn && (
						<>
							<div className="hidden md:flex space-x-4">
								<Button
									variant={pathname === '/' ? 'default' : 'ghost'}
									className="text-sm font-medium"
									asChild
								>
									<Link href="/">Home</Link>
								</Button>
								<Button
									variant={pathname === '/create' ? 'default' : 'ghost'}
									className="text-sm font-medium"
									asChild
								>
									<Link href="/create">Create</Link>
								</Button>
							</div>
							<div className="md:hidden">
								<Select
									defaultValue={
										pathname === '/' ? 'home' : pathname === '/create' ? 'create' : 'home'
									}
									onValueChange={(value) => router.push(value === 'home' ? '/' : '/create')}
								>
									<SelectTrigger className="w-[90px]">
										<SelectValue placeholder="Select" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="home">Home</SelectItem>
										<SelectItem value="create">Create</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</>
					)}
				</div>
				<div className="flex-1 px-4">
					<SearchBar />
				</div>
				<div className="flex items-center space-x-4">
					<ModeToggle />
					{!isSignedIn ? (
						<>
							<SignInButton mode="modal">
								<Button variant="ghost" size="sm">
									Log in
								</Button>
							</SignInButton>
							<SignUpButton mode="modal">
								<Button size="sm">Sign up</Button>
							</SignUpButton>
						</>
					) : (
						<UserButton>
							<UserButton.MenuItems>
								<UserButton.Link
									label="Board"
									labelIcon={<LayoutDashboard size={16} />}
									href={`/user/${user?.username}`}
								/>
								<UserButton.Link
									label="Profile"
									labelIcon={<UserRoundPen size={16} />}
									href="/profile"
								/>
								<UserButton.Action label="manageAccount" />
								<UserButton.Action label="signOut" />
							</UserButton.MenuItems>
						</UserButton>
					)}
				</div>
			</div>
		</div>
	)
}
