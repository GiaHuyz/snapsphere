'use client'

import BoardDropdown from '@/components/board-dropdown'
import { SaveButton } from '@/components/save-to-board-button'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Download, Eye, Flag, MoreHorizontal } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface PinProps {
	id: string
	image: string
	title: string
	currentBoard?: string
	isLoggedIn?: boolean
	suggestions?: {
		id: string
		name: string
	}[]
}

export default function Pin({ id, image, title, isLoggedIn }: PinProps) {
	return (
		<div className="group relative mb-4 w-full overflow-hidden rounded-xl cursor-pointer">
			{/* Main Image */}

			<Image src={image} alt={title} width={300} height={300} className="object-cover w-full" />

			<Link href={`/pin/${id}`}>
				{/* Overlay Actions */}
				<div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
					{/* Top Actions */}
					<div
						className={`absolute left-4 right-4 top-4 flex items-center ${
							isLoggedIn ? 'justify-between' : 'justify-end'
						}`}
					>
						{isLoggedIn && <BoardDropdown mode="save" />}
						<SaveButton variant="overlay" isLoggedIn={isLoggedIn} />
					</div>

					{/* Bottom Actions */}
					<div className="absolute bottom-4 right-4 flex items-center gap-2">
						<Button
							size="icon"
							variant="secondary"
							className="h-8 w-8 rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60"
							onClick={(e) => e.preventDefault()}
						>
							<Download className="h-4 w-4" />
						</Button>
						<DropdownMenu modal={false}>
							<DropdownMenuTrigger asChild>
								<Button
									size="icon"
									variant="secondary"
									className="h-8 w-8 rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60"
									onClick={(e) => e.preventDefault()}
								>
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" onClick={(e) => e.preventDefault()}>
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
			</Link>
		</div>
	)
}
