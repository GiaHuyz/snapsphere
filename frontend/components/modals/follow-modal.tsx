'use client'

import { Follows, getAllFollowsAction } from '@/actions/follow-actions'
import FollowButton from '@/components/follow-button'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useFollowModal } from '@/hooks/use-follow-modal'
import { isActionError } from '@/lib/errors'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'

interface FollowModalProps {
	userId: string
	followers: Follows[]
	following: Follows[]
}

const PAGE_SIZE = 10

export default function FollowModal({ userId, followers, following }: FollowModalProps) {
	const { isOpen, onClose, type } = useFollowModal()
	const title = type === 'followers' ? 'Followers' : 'Following'
	const [followersUser, setFollowers] = useState<Follows[]>(followers)
	const [followingUser, setFollowing] = useState<Follows[]>(following)
	const [scrollTrigger, isInView] = useInView()
	const [hasMore, setHasMore] = useState(true)
	const [page, setPage] = useState(2)

	const loadMoreFollows = async () => {
		if (hasMore) {
			let res
			if (type === 'followers') {
				res = await getAllFollowsAction({ followerId: userId, page: page, pageSize: PAGE_SIZE })
			} else {
				res = await getAllFollowsAction({ followingId: userId, page: page, pageSize: PAGE_SIZE })
			}

			if (!isActionError(res)) {
				if (type === 'followers') {
					setFollowers((prevFollows) => [...prevFollows, ...res])
				} else {
					setFollowing((prevFollows) => [...prevFollows, ...res])
				}
				setPage(page + 1)
				if(res.length < PAGE_SIZE) {
                    setHasMore(false)
                }
			}
		}
	}

	useEffect(() => {
		if (isInView && hasMore) {
			loadMoreFollows()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isInView, hasMore])

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-sm p-0 gap-0">
				<DialogHeader className="p-4 border-b text-center relative">
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>
				<ScrollArea className="h-96">
					<div className="p-4">
						{type === 'followers' &&
							followersUser.map((follow) => (
								<div key={follow.id} className="flex items-center justify-between py-2">
									<Link href={`/user/${follow.user.username}`} className="flex items-center gap-3">
										<Avatar className="h-12 w-12">
											<AvatarImage src={follow.user.imageUrl} alt={follow.user.username || ''} />
										</Avatar>
										<div className="flex flex-col">
											<span className="font-medium">{follow.user.fullName}</span>
											<span className="text-sm text-muted-foreground">
												@{follow.user.username}
											</span>
										</div>
									</Link>
									<FollowButton followingId={follow.user.id} isFollowing={follow.isFollowing} />
								</div>
							))}
                        {type === 'following' &&
                            followingUser.map((follow) => (
                                <div key={follow.id} className="flex items-center justify-between py-2">
                                    <Link href={`/user/${follow.user.username}`} className="flex items-center gap-3">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={follow.user.imageUrl} alt={follow.user.username || ''} />
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{follow.user.fullName}</span>
                                            <span className="text-sm text-muted-foreground">
                                                @{follow.user.username}
                                            </span>
                                        </div>
                                    </Link>
                                    <FollowButton followingId={follow.user.id} isFollowing={follow.isFollowing} />
                                </div>
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
			</DialogContent>
		</Dialog>
	)
}
