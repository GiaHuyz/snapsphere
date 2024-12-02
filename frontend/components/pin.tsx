'use client'

import { BoardDropdown } from '@/components/board-dropdown'
import { SaveButton } from '@/components/save-to-board-button'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { Download, Eye, Flag, MoreHorizontal } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'

interface PinProps {
	id: string
	image: string
	title: string
	currentBoard?: string
	boards?: {
		id: string
		name: string
		image?: string
	}[]
	suggestions?: {
		id: string
		name: string
	}[]
}

export function Pin({ id, image, title, currentBoard = 'wuxia', boards = [], suggestions = [] }: PinProps) {
	const [showActions, setShowActions] = React.useState(false)

	return (
		<div
			className="relative mb-4 w-full overflow-hidden rounded-xl"
			onMouseEnter={() => setShowActions(true)}
			onMouseLeave={() => setShowActions(false)}
		>
			{/* Main Image */}
			<Link href={`/pin/${id}`}>
				<Image src={image} alt={title} width={300} height={300} className="object-cover" />
			</Link>

			{/* Overlay Actions */}
			<div
				className={cn(
					'absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-200',
					showActions && 'opacity-100'
				)}
			>
				{/* Top Actions */}
				<div className="absolute left-4 right-4 top-4 flex items-center justify-between">
					<BoardDropdown
						currentBoard={currentBoard}
						boards={boards}
						suggestions={suggestions}
						variant="overlay"
						onSave={() => {}}
						onCreate={() => {}}
					/>
					<SaveButton variant="overlay" />
				</div>

				{/* Bottom Actions */}
				<div className="absolute bottom-4 right-4 flex items-center gap-2">
					<Button
						size="icon"
						variant="secondary"
						className="h-8 w-8 rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60"
					>
						<Download className="h-4 w-4" />
					</Button>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								size="icon"
								variant="secondary"
								className="h-8 w-8 rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60"
							>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem>
								<Eye className="mr-2 h-4 w-4" />
								Hide Pin
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Download className="mr-2 h-4 w-4" />
								Download image
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem className="text-red-600">
								<Flag className="mr-2 h-4 w-4" />
								Report Pin
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</div>
	)
}
