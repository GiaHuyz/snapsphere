'use client'

import { getUsersLikedPinAction } from '@/actions/like-actions'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useLikesListModal } from '@/hooks/use-likes-list-modal'
import { PAGE_SIZE_USERS_LIKES } from '@/lib/constants'
import { isActionError } from '@/lib/errors'
import { cn } from '@/lib/utils'
import { User } from '@clerk/nextjs/server'
import { Heart, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'

export default function LikesListModal() {
	const { isOpen, onClose, pinId } = useLikesListModal()
	const [usersLiked, setUsersLiked] = useState<User[]>([])
	const [hasMore, setHasMore] = useState(true)
	const [page, setPage] = useState(0)
	const [scrollTrigger, isInView] = useInView()

	const fetchMoreUsers = async () => {
		if (pinId) {
			const users = await getUsersLikedPinAction({ pinId, page: page + 1, pageSize: PAGE_SIZE_USERS_LIKES })
			if (!isActionError(users)) {
				setUsersLiked((prevUsers) => [...prevUsers, ...users])
				setPage(page + 1)
				if (users.length < PAGE_SIZE_USERS_LIKES) {
					setHasMore(false)
				}
			}
		}
	}

	useEffect(() => {
		if (isInView && hasMore) {
			fetchMoreUsers()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isInView, hasMore])

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="w-11/12 rounded-2xl sm:rounded-2xl sm:max-w-[425px] max-h-[calc(100vh-64px)] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="text-center text-xl font-semibold">Likes</DialogTitle>
				</DialogHeader>
				<ScrollArea className="h-96">
					<div className="space-y-4">
						{usersLiked.map((user) => (
							<div key={user.id}>
								<Link href={`/user/${user.username}`} className={cn('flex items-center justify-between')} onClick={onClose}>
									<div className="flex items-center gap-2">
										<Avatar className="h-9 w-9">
											<AvatarImage src={user.imageUrl} alt={user.username || ''} />
											<AvatarFallback>{user.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
										</Avatar>
										<span className="font-medium text-sm">
											{user.firstName + ' ' + user.lastName}
										</span>
									</div>
                                    <div>
                                        <Heart className="h-6 w-6 fill-red-500" />
                                    </div>
								</Link>
							</div>
						))}
						<div>
							{hasMore && (
								<div ref={scrollTrigger} className="flex items-center justify-center">
									<Loader2 className="h-4 w-4 animate-spin" />
								</div>
							)}
						</div>
					</div>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	)
}
