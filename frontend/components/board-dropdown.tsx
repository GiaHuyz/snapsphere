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
import { useCreateBoardModal } from '@/hooks/use-create-board-modal'
import { Plus, Search } from 'lucide-react'
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
	mode: 'select' | 'save'
	onChange?: (board: Board) => void
	onSave?: (boardId: string) => void
	onCreate?: (name: string) => void
	children: React.ReactNode
}

export function BoardDropdown({ mode, onChange, onSave, onCreate, children }: BoardDropdownProps) {
	const { onOpen, setImage } = useCreateBoardModal()

	const defaultBoards: Board[] = [
		{
			id: '1',
			name: 'wuxia',
			image: 'https://i.pinimg.com/custom_covers/200x150/673499387963719022_1733038015.jpg'
		},
		{
			id: '2',
			name: 'Ancient Greece',
			image: 'https://plus.unsplash.com/premium_photo-1731624534286-adf5e9c78159?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
		}
	]

	const defaultSuggestions: Suggestion[] = [
		{ id: '3', name: 'Asian landscape' },
		{ id: '4', name: 'Wall decor design' },
		{ id: '5', name: 'Art deco wall' },
		{ id: '6', name: 'Asian architecture' },
		{ id: '7', name: 'Modern architecture' },
		{ id: '8', name: 'Urban planning' }
	]

	const handleSelect = (board: Board) => {
		if (mode === 'select' && onChange) {
			onChange(board)
		}
	}

	return (
		<>
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
				<DropdownMenuContent
					align="start"
					className="w-[340px] rounded-2xl"
					onClick={(e) => e.preventDefault()}
				>
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
							className="relative flex items-center gap-2 p-2 cursor-pointer group"
							onClick={() => handleSelect(board)}
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
							{mode === 'save' && (
								<div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
									<SaveButton onClick={() => onSave?.(board.id)} />
								</div>
							)}
						</DropdownMenuItem>
					))}
					<DropdownMenuSeparator />
					{mode === 'save' && (
						<>
							<DropdownMenuLabel>Suggestions</DropdownMenuLabel>
							<div className="overflow-y-auto max-h-[200px]">
								{defaultSuggestions.map((suggestion) => (
									<DropdownMenuItem
										key={suggestion.id}
										className="flex items-center gap-2 p-2 cursor-pointer group"
									>
										<div className="flex flex-1 items-center gap-2">
											<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
												<Plus className="h-6 w-6" />
											</div>
											<span className="line-clamp-1">{suggestion.name}</span>
										</div>
										<div className="opacity-0 group-hover:opacity-100">
											<Button
												className="rounded-full min-w-14"
												onClick={() => onCreate?.(suggestion.name)}
											>
												Create
											</Button>
										</div>
									</DropdownMenuItem>
								))}
							</div>
							<DropdownMenuSeparator />
						</>
					)}
					<DropdownMenuItem
						className="flex items-center gap-2 p-2 cursor-pointer"
						onClick={() => {
                            setImage('https://plus.unsplash.com/premium_photo-1731624534286-adf5e9c78159?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')
                            onOpen()
                        }}
					>
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
							<Plus className="h-6 w-6" />
						</div>
						<span>Create board</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	)
}
