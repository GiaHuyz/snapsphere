'use client'

import { Board } from '@/actions/board-actions'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useEditBoardModal } from '@/hooks/use-edit-board-modal'
import { User } from '@clerk/nextjs/server'
import { Pencil, Share2 } from 'lucide-react'

interface BoardHeaderProps {
	board: Board
	user: User
    isOwner: boolean
}

export default function BoardHeader({ board, user, isOwner }: BoardHeaderProps) {
	const { onOpen } = useEditBoardModal()

	const handleShare = () => {
		// Implement share functionality
		navigator.clipboard
			.writeText(window.location.href)
			.then(() => alert('Board link copied to clipboard!'))
			.catch((err) => console.error('Failed to copy: ', err))
	}

	return (
		<div className="flex flex-col items-center space-y-4">
			<h1 className="text-3xl font-bold">{board.title}</h1>
			<p className="text-muted-foreground text-center max-w-2xl">{board.description}</p>
			<div className="flex items-center space-x-2">
				<Avatar className="h-10 w-10">
					<AvatarImage src={user.imageUrl} alt={user.username || ''} />
					<AvatarFallback>{user.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
				</Avatar>
				<span className="font-medium">{user.username}</span>
			</div>
			<p className="text-sm text-muted-foreground">{board.pinCount} Pins</p>
			<div className="flex space-x-4">
				<Button onClick={handleShare} variant="outline" className="rounded-full">
					<Share2 className="mr-2 h-4 w-4" />
					Share
				</Button>
				{isOwner && <Button
					onClick={() =>
						onOpen(board._id, {
							title: board.title,
							description: board.description,
							secret: board.secret,
							coverImage: board.coverImages[0]?.url
						})
					}
					variant="outline"
					className="rounded-full"
				>
					<Pencil className="mr-2 h-4 w-4" />
					Edit
				</Button>}
			</div>
		</div>
	)
}
