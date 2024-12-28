'use client'

import { cn } from '@/lib/utils'
import { BarChart, Users, Image, Flag, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const routes = [
	{
		href: '/admin',
		label: 'Overview',
		icon: BarChart,
		color: 'text-sky-500'
	},
	{
		href: '/admin/users',
		label: 'Users',
		icon: Users,
		color: 'text-violet-500'
	},
	{
		href: '/admin/pins',
		label: 'Pins',
		icon: Image,
		color: 'text-pink-700'
	},
	{
		href: '/admin/reports',
		label: 'Reports',
		icon: Flag,
		color: 'text-orange-700'
	},
	{
		href: '/admin/settings',
		label: 'Settings',
		icon: Settings,
		color: 'text-gray-500'
	}
]

export default function AdminSidebar() {
	const pathname = usePathname()

	return (
		<div className="space-y-4 py-4 flex flex-col h-full bg-gray-900 text-white">
			<div className="px-3 py-2 flex-1">
				<Link href="/admin" className="flex items-center pl-3 mb-14">
					<h1 className="text-2xl font-bold">Admin</h1>
				</Link>
				<div className="space-y-1">
					{routes.map((route) => (
						<Link
							key={route.href}
							href={route.href}
							className={cn(
								'text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition',
								pathname === route.href ? 'text-white bg-white/10' : 'text-zinc-400'
							)}
						>
							<div className="flex items-center flex-1">
								<route.icon className={cn('h-5 w-5 mr-3', route.color)} />
								{route.label}
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	)
}

