'use client'

import { likeAction, unlikeAction } from '@/actions/like-actions'
import { Button } from '@/components/ui/button'
import { isActionError } from '@/lib/errors'
import { cn } from '@/lib/utils'
import { Heart } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function LikeCommentButton({
	commentId,
	isLiked,
	likeCount
}: {
	commentId: string
	isLiked: boolean
	likeCount: number
}) {
	const [liked, setLiked] = useState(isLiked)
	const [likeAmount, setLikeAmount] = useState(likeCount)

	const handleLike = async () => {
		if (!liked) {
			const res = await likeAction({ item_id: commentId, type: 'comment' })
			if (isActionError(res)) {
				return toast.error(res.error)
			}

			setLikeAmount(likeAmount + 1)
		} else {
			const res = await unlikeAction(commentId)
			if (isActionError(res)) {
				return toast.error(res.error)
			}

			setLikeAmount(likeAmount - 1)
		}
		setLiked(!liked)
	}

	return (
		<>
			<Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleLike}>
				<Heart className={cn('h-5 w-5', liked ? 'fill-red-500' : 'fill-none')} />
			</Button>
			<span className="text-xs text-muted-foreground">{likeAmount} likes</span>
		</>
	)
}
