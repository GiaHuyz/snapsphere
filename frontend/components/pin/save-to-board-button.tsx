'use client'

import { savePinToBoardAction } from '@/actions/pin-actions'
import { Button } from '@/components/ui/button'
import { useCreateBoardModal } from '@/hooks/use-create-board-modal'
import { isActionError } from '@/lib/errors'
import { checkUserPage, cn } from '@/lib/utils'
import { useBoardDropdownStore } from '@/provider/board-dropdown-provider'
import { useBoardPreviewStore } from '@/stores/use-board-preview-store'
import { useClerk } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import { toast } from 'sonner'

interface SaveButtonProps {
	className?: string
	pinId: string
	pinUrl: string
	boardId: string
	variant?: 'default' | 'overlay'
	isLoggedIn?: boolean
}

export function SaveButton({ className, variant = 'default', isLoggedIn, pinId, pinUrl, boardId }: SaveButtonProps) {
	const clerk = useClerk()
	const { setPin, onOpen } = useCreateBoardModal()
	const { boardsPreview, setBoardsPreview } = useBoardPreviewStore()
    const { boardsDropdown, setBoardsDropdown } = useBoardDropdownStore()
	const pathname = usePathname()

	const handleClick = async (e: React.MouseEvent) => {
		e.preventDefault()
		if (!isLoggedIn) {
			return clerk.openSignIn()
		}

		if (!boardId) {
			setPin({ _id: pinId, url: pinUrl })
			return onOpen()
		}

		const res = await savePinToBoardAction({ pin_id: pinId, board_id: boardId })
		if (isActionError(res)) {
			toast.error(res.error)
		} else {
			toast.success('Pin saved successfully')
			if (checkUserPage(pathname)) {
				const updatedBoards = boardsPreview.map((board) => {
					if (board._id === boardId) {
						if (board.coverImages.length < 3) {
							board.coverImages.push({
								_id: pinId,
								url: pinUrl
							})
							board.pinCount++
						}
					}
					return board
				})
				setBoardsPreview(updatedBoards)
			}
            const updatedBoardsDropdown = boardsDropdown.map((board) => {
                if (board._id === boardId) {
                    if (board.coverImages.length < 3) {
                        board.coverImages.push({
                            _id: pinId,
                            url: pinUrl
                        })
                        board.pinCount++
                    }
                }
                return board
            })
            setBoardsDropdown(updatedBoardsDropdown)
		}
	}

	return (
		<Button
			className={cn(
				'rounded-full',
				variant === 'default' && 'bg-red-500 text-white hover:bg-red-600',
				variant === 'overlay' && 'h-8 bg-red-500 px-4 text-white hover:bg-red-600',
				className
			)}
			onClick={handleClick}
			data-prevent-nprogress={true}
		>
			Save
		</Button>
	)
}
