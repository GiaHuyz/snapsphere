'use client'

import { Board } from '@/actions/board-actions'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useBoardDetailStore } from '@/hooks/use-board-detail-store'
import { useEditBoardModal } from '@/hooks/use-edit-board-modal'
import { useMounted } from '@/hooks/use-mouted'
import { User } from '@clerk/nextjs/server'
import { Pencil, Share2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

interface BoardHeaderProps {
	initBoard: Board
	user: User
	isOwner: boolean
}

export default function BoardHeader({ initBoard, user, isOwner }: BoardHeaderProps) {
	const { onOpen } = useEditBoardModal()
	const { board, setBoard } = useBoardDetailStore()
	const isMounted = useMounted()

	const handleShare = () => {
		navigator.clipboard
			.writeText(window.location.href)
			.then(() => alert('Board link copied to clipboard!'))
			.catch((err) => console.error('Failed to copy: ', err))
	}

	useEffect(() => {
		setBoard(initBoard)
	}, [initBoard, setBoard])

	return (
		<div className="flex flex-col items-center space-y-4">
			<h1 className="text-3xl font-bold">{(isMounted ? board : initBoard).title}</h1>
			<p className="text-muted-foreground text-center max-w-2xl">{(isMounted ? board : initBoard).description}</p>
			<Link href={`/user/${user.username}`} className="flex items-center space-x-2 group">
				<Avatar className="h-10 w-10">
					<AvatarImage src={user.imageUrl} alt={user.username || ''} />
					<AvatarFallback>{user.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
				</Avatar>
				<span className="font-medium group-hover:underline">{user.username}</span>
			</Link>
			<p className="text-sm text-muted-foreground">{(isMounted ? board : initBoard).pinCount} Pins</p>
			<div className="flex space-x-4">
				<Button onClick={handleShare} variant="outline" className="rounded-full">
					<Share2 className="mr-2 h-4 w-4" />
					Share
				</Button>
				{isOwner && (
					<Button onClick={() => onOpen(board._id, board)} variant="outline" className="rounded-full">
						<Pencil className="mr-2 h-4 w-4" />
						Edit
					</Button>
				)}
			</div>
		</div>
	)
}
