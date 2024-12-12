'use client'

import { Board } from '@/actions/board-actions'
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
import { useBoardDropdownStore } from '@/provider/board-provider'
import { useUser } from '@clerk/nextjs'
import { ChevronDown, Plus, Search } from 'lucide-react'
import Image from 'next/image'
import * as React from 'react'
import { SaveButton } from './save-to-board-button'

interface Suggestion {
	id: string
	name: string
}

interface BoardDropdownProps {
	mode: 'select' | 'save'
    pinId?: string
	onChange?: (board: Board) => void
	children?: React.ReactNode
}

export default function BoardDropdown({ mode, onChange, pinId, children }: BoardDropdownProps) {
	const { onOpen, setImage } = useCreateBoardModal()
	const { boardsDropdown } = useBoardDropdownStore()
	const { isSignedIn } = useUser()

	const defaultSuggestions: Suggestion[] = [
		{ id: '3', name: 'Asian landscape' },
		{ id: '4', name: 'Wall decor design' },
		{ id: '5', name: 'Art deco wall' },
		{ id: '6', name: 'Asian architecture' }
	]

	const handleSelect = (board: Board) => {
		if (mode === 'select' && onChange) {
			onChange(board)
		}
	}

	return (
		<DropdownMenu modal={false}>
			{mode === 'save' ? (
				<DropdownMenuTrigger asChild>
					<Button
						variant="secondary"
						className={'h-8 rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60'}
						onClick={(e) => e.preventDefault()}
					>
						{boardsDropdown[0]?.title}
						<ChevronDown className="ml-1 h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
			) : (
				<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
			)}
			<DropdownMenuContent
				align="start"
				className="w-[340px] overflow-hidden rounded-2xl"
				onClick={(e) => e.preventDefault()}
			>
				<div className="p-2">
					<div className="relative">
						<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground " />
						<Input placeholder="Search boards" className="pl-8 rounded-full" />
					</div>
				</div>
				<div className="h-[290px] overflow-y-auto overflow-x-hidden">
					<DropdownMenuLabel>All boards</DropdownMenuLabel>
					{boardsDropdown.map((board) => (
						<DropdownMenuItem
							key={board._id}
							className="relative flex items-center gap-2 p-2 cursor-pointer group"
							onClick={() => handleSelect(board)}
						>
							<div className="flex flex-1 items-center gap-2">
								{board.coverImages[0] && (
									<div className="h-12 w-12 overflow-hidden rounded-lg">
										<Image
											src={board.coverImages[0]}
											alt={board.title}
											width={48}
											height={48}
											className="h-full w-full object-cover"
										/>
									</div>
								)}
								<span className="line-clamp-1">{board.title}</span>
							</div>
							{mode === 'save' && (
								<div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
									<SaveButton isLoggedIn={isSignedIn} pinId={pinId!} boardId={board._id} />
								</div>
							)}
						</DropdownMenuItem>
					))}
					<DropdownMenuSeparator />
					{mode === 'save' && (
						<>
							<DropdownMenuLabel>Suggestions</DropdownMenuLabel>
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
										<Button className="rounded-full min-w-14">Create</Button>
									</div>
								</DropdownMenuItem>
							))}
							<DropdownMenuSeparator />
						</>
					)}
				</div>
				<DropdownMenuItem
					className="flex items-center gap-2 p-2 cursor-pointer"
					onClick={() => {
						setImage(
							`${
								mode === 'save'
									? 'https://plus.unsplash.com/premium_photo-1731624534286-adf5e9c78159?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
									: ''
							}`
						)
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
	)
}
