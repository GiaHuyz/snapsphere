'use client'

import { Board, getBoardsAction } from '@/actions/board-actions'
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
import { useBoardDropdownStore } from '@/hooks/use-board-dropdown-store'
import { useCreateBoardModal } from '@/hooks/use-create-board-modal'
import { PAGE_SIZE_BOARDS } from '@/lib/constants'
import { isActionError } from '@/lib/errors'
import { useUser } from '@clerk/nextjs'
import { ChevronDown, Loader2, Plus, Search } from 'lucide-react'
import Image from 'next/image'
import { ChangeEvent, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { SaveButton } from './save-to-board-button'

interface BoardDropdownProps {
	mode: 'select' | 'save'
	pin?: {
		_id: string
		url: string
	}
	boardsDropdown: Board[]
	onChange?: (board: Board) => void
	children?: React.ReactNode
}

export default function BoardDropdown({ mode, onChange, pin, boardsDropdown, children }: BoardDropdownProps) {
	const { onOpen, setPin } = useCreateBoardModal()
	const { isSignedIn, user } = useUser()
	const { boards, setBoards } = useBoardDropdownStore()
	const [filteredBoards, setFilteredBoards] = useState<Board[]>(boardsDropdown)
	const [search, setSearch] = useState('')
	const [page, setPage] = useState(2)
	const [hasMore, setHasMore] = useState(true)
	const [scrollTrigger, isInView] = useInView()

	const handleSelect = (board: Board) => {
		if (mode === 'select' && onChange) {
			onChange(board)
		}
	}

	const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.value.startsWith(' ')) return
		setSearch(e.target.value)
		const query = e.target.value.toLowerCase()
		const filteredBoards = boards.filter((board) => board.title.toLowerCase().includes(query))
		setFilteredBoards(filteredBoards)
	}

	const loadMoreBoards = async () => {
		const newBoards = await getBoardsAction({ user_id: user?.id, page: page, pageSize: PAGE_SIZE_BOARDS })
		if (!isActionError(newBoards)) {
            setBoards([...boards, ...newBoards])
			setPage((prevPage) => prevPage + 1)
			if (newBoards.length < PAGE_SIZE_BOARDS) {
				setHasMore(false)
			}
		}
	}

	useEffect(() => {
		if (isInView && hasMore) {
			loadMoreBoards()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hasMore, isInView])

	useEffect(() => {
		setBoards(boardsDropdown)
	}, [boardsDropdown, setBoards])

	return (
		<>
			<DropdownMenu modal={false}>
				{mode === 'save' ? (
					<DropdownMenuTrigger asChild>
						<Button
							variant="secondary"
							className={'h-8 rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60'}
							onClick={(e) => e.preventDefault()}
							data-prevent-nprogress={true}
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
							<Input
								value={search}
								onChange={handleSearch}
								placeholder="Search boards"
								className="pl-8 rounded-full"
							/>
						</div>
					</div>
					<div className="h-[290px] overflow-y-auto overflow-x-hidden">
						<DropdownMenuLabel>All boards</DropdownMenuLabel>
						{(search ? filteredBoards : boards).map((board) => (
							<DropdownMenuItem
								key={board._id}
								className="relative flex items-center gap-2 p-2 cursor-pointer group"
								onClick={() => handleSelect(board)}
							>
								<div className="flex flex-1 items-center gap-2">
									{board.coverImages[0] ? (
										<div className="h-12 w-12 overflow-hidden rounded-lg">
											<Image
												src={board.coverImages[0].url}
												alt={board.title}
												width={48}
												height={48}
												className="h-full w-full object-cover"
											/>
										</div>
									) : (
                                        <div className="h-12 w-12 rounded-lg bg-secondary">
                                        </div>
                                    )}
									<span className="line-clamp-1">{board.title}</span>
								</div>
								{mode === 'save' && (
									<div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
										<SaveButton
											isLoggedIn={isSignedIn}
											pinId={pin!._id}
											pinUrl={pin!.url}
											boardId={board._id}
										/>
									</div>
								)}
							</DropdownMenuItem>
						))}
						<div className="flex items-center justify-center">
							{hasMore && (
								<div ref={scrollTrigger}>
									<Loader2 className="h-4 w-4 animate-spin" />
								</div>
							)}
						</div>
						<DropdownMenuSeparator />
					</div>
					<DropdownMenuItem
						className="flex items-center gap-2 p-2 cursor-pointer"
						onClick={() => {
							setPin({
								_id: pin?._id,
								url: `${mode === 'save' ? pin!.url : ''}`
							})
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
