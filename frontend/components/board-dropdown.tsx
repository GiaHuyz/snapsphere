'use client'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { ChevronDown, Plus, Search } from 'lucide-react'
import Image from 'next/image'
import * as React from 'react'
import { SaveButton } from './save-to-board-button'

interface Board {
	id: string
	name: string
	image?: string
}

interface Suggestion {
	id: string
	name: string
}

interface BoardDropdownProps {
	currentBoard: string
	boards?: Board[]
	suggestions?: Suggestion[]
	variant?: 'default' | 'overlay'
	onSave?: (boardId: string) => void
	onCreate?: (name: string) => void
}

export function BoardDropdown({
	currentBoard,
	boards = [],
	suggestions = [],
	variant = 'default',
	onSave,
	onCreate
}: BoardDropdownProps) {
	const [hoveredItem, setHoveredItem] = React.useState<string | null>(null)

	const defaultBoards = boards.length
		? boards
		: [
				{
					id: '1',
					name: 'wuxia',
					image: 'https://i.pinimg.com/custom_covers/200x150/673499387963719022_1733038015.jpg'
				}
		  ]

	const defaultSuggestions = suggestions.length
		? suggestions
		: [
				{ id: '2', name: 'Asian landscape' },
				{ id: '3', name: 'Wall decor design' },
				{ id: '4', name: 'Art deco wall' },
				{ id: '5', name: 'Asian architecture' },
				{ id: '6', name: 'Asian architecture' },
                { id: '7', name: 'Asian architecture' },
		  ]

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<Button
					variant="secondary"
					className={
						variant === 'overlay'
							? 'h-8 rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60'
							: 'rounded-full'
					}
				>
					{currentBoard}
					<ChevronDown className="ml-1 h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-[340px] rounded-2xl">
				<div className="p-2">
					<div className="relative">
						<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground " />
						<Input placeholder="Search boards" className="pl-8 rounded-full" />
					</div>
				</div>
				<DropdownMenuLabel>All boards</DropdownMenuLabel>
				{defaultBoards.map((board) => (
					<DropdownMenuItem
						key={board.id}
						className="relative flex items-center gap-2 p-2 cursor-pointer"
						onMouseEnter={() => setHoveredItem(board.id)}
						onMouseLeave={() => setHoveredItem(null)}
					>
						<div className="flex flex-1 items-center gap-2">
							{board.image && (
								<div className="h-12 w-12 overflow-hidden rounded-lg">
									<Image
										src={board.image}
										alt={board.name}
										width={48}
										height={48}
										className="h-full w-full object-cover"
									/>
								</div>
							)}
							<span className="line-clamp-1">{board.name}</span>
						</div>
						{hoveredItem === board.id && (
							<SaveButton className="absolute right-2" onClick={() => onSave?.(board.id)} />
						)}
					</DropdownMenuItem>
				))}
				<DropdownMenuSeparator />
				<DropdownMenuLabel>Suggestions</DropdownMenuLabel>
				<div className="overflow-y-auto max-h-[200px]">
					{defaultSuggestions.map((suggestion) => (
						<DropdownMenuItem
							key={suggestion.id}
							className="flex items-center gap-2 p-2 cursor-pointer"
							onMouseEnter={() => setHoveredItem(suggestion.id)}
							onMouseLeave={() => setHoveredItem(null)}
						>
							<div className="flex flex-1 items-center gap-2">
								<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
									<Plus className="h-6 w-6" />
								</div>
								<span className="line-clamp-1">{suggestion.name}</span>
							</div>
							{hoveredItem === suggestion.id && (
								<Button
									className="rounded-full min-w-14"
									onClick={() => onCreate?.(suggestion.name)}
								>
									Create
								</Button>
							)}
						</DropdownMenuItem>
					))}
				</div>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="flex items-center gap-2 p-2">
					<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
						<Plus className="h-6 w-6" />
					</div>
					<span>Create board</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
