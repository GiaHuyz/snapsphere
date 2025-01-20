'use client'

import { Board, getBoardsAction, mergeBoardsAction } from '@/actions/board-actions'
import { LoaderButton } from '@/components/loading-button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useMergeBoardModal } from '@/hooks/use-merge-board-modal'
import { PAGE_SIZE_BOARDS } from '@/lib/constants'
import { isActionError } from '@/lib/errors'
import { cn } from '@/lib/utils'
import { useUser } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { toast } from 'sonner'

export function MergeBoardModal() {
	const { isOpen, onClose, currentBoard } = useMergeBoardModal()
	const [selectedBoardId, setSelectedBoardId] = useState<string>('')
	const [isLoading, setIsLoading] = useState(false)
	const [availableBoards, setAvailableBoards] = useState<Board[]>([])
	const [scrollTrigger, isInView] = useInView()
	const [page, setPage] = useState(0)
	const [hasMore, setHasMore] = useState(true)
    const router = useRouter()
    const { user } = useUser()

	const loadMoreBoards = async () => {
		const boards = await getBoardsAction({ page: page + 1, user_id: currentBoard.user_id })
		if (!isActionError(boards)) {
			setAvailableBoards((prev) => [...prev, ...boards])
			setPage((prevPage) => prevPage + 1)
			if (boards.length < PAGE_SIZE_BOARDS) {
				setHasMore(false)
			}
		}
	}

	const handleMerge = async () => {
		if (!selectedBoardId) return
		setIsLoading(true)
		
        const res = await mergeBoardsAction({
            currentBoardId: currentBoard._id,
            selectedBoardId: selectedBoardId
        })

        if (isActionError(res)) {
            toast.error(res.error)
        } else {
            toast.success('Boards merged successfully')
            router.push(`/user/${user?.username}`)
        }

		setIsLoading(false)
		onClose()
	}

	useEffect(() => {
		if (isInView) {
			loadMoreBoards()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isInView])

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="w-11/12 max-w-md rounded-2xl sm:rounded-2xl max-h-[calc(100vh-64px)] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="text-xl font-semibold">Combine boards</DialogTitle>
				</DialogHeader>
				<div className="space-y-4 py-4">
					<p className="text-center">
						Your board <span className="font-bold">{currentBoard.title}</span> and all{' '}
						<span className='font-bold'>{currentBoard.pinCount}</span> pins will be gone for good. You won&apos;t be able to get them back.
					</p>
					<div className="space-y-2">
						<h3 className="text-sm font-medium">All boards</h3>
						<ScrollArea className="h-[300px]">
							<div className="space-y-2">
								{availableBoards
									.filter((board) => board._id !== currentBoard._id)
									.map((board) => (
										<button
											key={board._id}
											onClick={() => setSelectedBoardId(board._id)}
											className={cn(
												'w-full flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors',
												selectedBoardId === board._id && 'bg-accent'
											)}
										>
											<div className="relative h-12 w-12 overflow-hidden rounded-lg">
												{board.coverImages[0] ? (
													<Image
														src={board.coverImages[0].url}
														alt={board.title}
														fill
														className="object-cover"
													/>
												) : (
													<div className="h-full w-full bg-muted" />
												)}
											</div>
											<div className="flex flex-col items-start">
												<span className="font-medium">{board.title}</span>
												<span className="text-sm text-muted-foreground">
													{board.pinCount} {board.pinCount === 1 ? 'Pin' : 'Pins'}
												</span>
											</div>
										</button>
									))}
								<div className="flex justify-center">
									{hasMore && (
										<div ref={scrollTrigger}>
											<Loader2 className="h-4 w-4 animate-spin" />
										</div>
									)}
								</div>
							</div>
						</ScrollArea>
					</div>
				</div>
				<LoaderButton
					onClick={handleMerge}
					disabled={!selectedBoardId}
					className="w-full"
					isLoading={isLoading}
				>
					Merge
				</LoaderButton>
			</DialogContent>
		</Dialog>
	)
}
