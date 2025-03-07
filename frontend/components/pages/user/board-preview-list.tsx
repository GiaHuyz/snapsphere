'use client'

import { Board, getBoardsAction } from '@/actions/board-actions'
import BoardPreview from '@/components/pages/user/board-preview'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useCreateBoardModal } from '@/hooks/use-create-board-modal'
import { useMounted } from '@/hooks/use-mouted'
import { PAGE_SIZE_BOARDS } from '@/lib/constants'
import { isActionError } from '@/lib/errors'
import { cn } from '@/lib/utils'
import { useBoardPreviewStore } from '@/stores/use-board-preview-store'
import { useUser } from '@clerk/nextjs'
import { Check, Loader2, Plus, Settings2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'

export default function BoardPreviewList({
	initBoardsPreview,
	userId,
	userSort,
	username,
	search
}: {
	initBoardsPreview: Board[]
	userId: string,
	username: string,
	search?: string,
	userSort?: string
}) {
	const { onOpen } = useCreateBoardModal()
	const { boardsPreview, setBoardsPreview } = useBoardPreviewStore()
	const [scrollTrigger, isInView] = useInView()
	const [page, setPage] = useState(2)
	const [hasMore, setHasMore] = useState(true)
	const isMouted = useMounted()
	const { user } = useUser()
	const [sort, setSort] = useState<string>(userSort || 'createdAt-desc')

	const handleSort = async (value: string) => {
		const res = await getBoardsAction({ user_id: userId, sort: value })
		if (!isActionError(res)) {
			setBoardsPreview(res.data)
			await user?.update({
				unsafeMetadata: {
					sort: value
				}
			})
			setSort(value)
		}
	}

	const loadMoreBoards = async () => {
		const res = await getBoardsAction({ user_id: userId, title: search, page: page, pageSize: PAGE_SIZE_BOARDS, sort: userSort })
		if (!isActionError(res)) {
			setBoardsPreview([...boardsPreview, ...res.data])
			setPage(page + 1)
			if (res.data.length < PAGE_SIZE_BOARDS) {
				setHasMore(false)
			}
		}
	}

	useEffect(() => {
		setBoardsPreview(initBoardsPreview)
	}, [initBoardsPreview, setBoardsPreview])

	useEffect(() => {
		if (isInView && hasMore) {
			loadMoreBoards()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isInView, hasMore])

	return (
		<>
			{!search && <div className="flex justify-between items-center">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button className="rounded-full">
							<Settings2 className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start">
						<DropdownMenuItem className="flex justify-between cursor-pointer" onClick={() => handleSort('title-asc')}>
							A-Z
							{sort === 'title-asc' && <Check className="h-4 w-4" />}
						</DropdownMenuItem>
						<DropdownMenuItem className="flex justify-between cursor-pointer" onClick={() => handleSort('createdAt-desc')}>
							Created At
							{sort === 'createdAt-desc' && <Check className="h-4 w-4" />}
						</DropdownMenuItem>
						<DropdownMenuItem className="flex justify-between cursor-pointer" onClick={() => handleSort('pinCount-desc')}>
							Pin Count
							{sort === 'pinCount-desc' && <Check className="h-4 w-4" />}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				<Button className="rounded-full" onClick={() => onOpen()}>
					<Plus />
				</Button>
			</div>}
			<div className={cn("grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6 mt-6", search && "px-2 mt-0")}>
				{(isMouted ? boardsPreview : initBoardsPreview).map((board) => (
					<BoardPreview key={board._id} {...board} username={username} />
				))}
			</div>
			<div className="flex justify-center mt-8">
				{hasMore && (
					<div ref={scrollTrigger}>
						<Loader2 className="h-8 w-8 animate-spin" />
					</div>
				)}
			</div>
		</>
	)
}
