'use client'

import { likeAction, unlikeAction } from '@/actions/like-actions'
import { Pin } from '@/actions/pin-actions'
import BoardDropdown from '@/components/board-dropdown'
import PinActions from '@/components/pin/pin-actions'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useLikesListModal } from '@/hooks/use-likes-list-modal'
import { isActionError } from '@/lib/errors'
import { Heart, MoreHorizontal, Save } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function PinDetailTopActions({ pin }: { pin: Pin }) {
	const [liked, setLiked] = useState(pin.isLiked)
	const [likeCount, setLikeCount] = useState(pin.likeCount)
	const { onOpen } = useLikesListModal()

	const handleLike = async () => {
		if (liked) {
			const res = await unlikeAction(pin._id)
			if (isActionError(res)) {
				return toast.error(res.error)
			}
			setLiked(!liked)
			setLikeCount(likeCount - 1)
		} else {
			const res = await likeAction({ item_id: pin._id, type: 'pin' })
			if (isActionError(res)) {
				return toast.error(res.error)
			}
			setLiked(!liked)
			setLikeCount(likeCount + 1)
		}
	}

	return (
		<div className="flex items-center justify-between pb-4">
			<div className="flex items-center gap-2">
				<Button onClick={handleLike} className="rounded-full px-3 py-2">
					<Heart className={`h-5 w-5 ${liked ? 'fill-red-500' : 'fill-none'}`} />
				</Button>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								className="text-xl font-medium rounded-full bg-secondary"
								variant="ghost"
								onClick={() => onOpen(pin._id)}
							>
								{likeCount}
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Like Count</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<div className="flex gap-2 items-center rounded-full h-9 py-2 px-3 bg-secondary cursor-pointer">
								<Save className="h-3 w-3" />
								{pin.saveCount}
							</div>
						</TooltipTrigger>
						<TooltipContent>
							<p>Save Count</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
				<PinActions pin={pin}>
					<Button size="icon" variant="secondary" className="rounded-full">
						<MoreHorizontal className="h-5 w-5" />
					</Button>
				</PinActions>
			</div>
			<div className="flex items-center gap-2">
				<BoardDropdown mode="save" pin={pin} />
			</div>
		</div>
	)
}
