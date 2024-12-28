// TODO:FIX: Comment bị trùng màu với background khi ở chế độ dark mode
import { Board, getBoardsAction } from '@/actions/board-actions'
import { getCommentsAction } from '@/actions/comment-action'
import { checkFollowAction } from '@/actions/follow-actions'
import { getPinDetailAction } from '@/actions/pin-actions'
import BoardDropdown from '@/components/board-dropdown'
import { CommentSection } from '@/components/comment-section'
import ExpandButton from '@/components/expand-button'
import FollowButton from '@/components/follow-button'
import FullScreenViewModal from '@/components/modals/full-screen-view-modal'
import PinActions from '@/components/pin-actions'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { isActionError, ServerActionResponse } from '@/lib/errors'
import getCurrentUser from '@/lib/get-current-user'
import { clerkClient } from '@clerk/nextjs/server'
import { Heart, MoreHorizontal, Share2 } from 'lucide-react'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
	title: 'Snapsphere | Pin'
}

export default async function PinDetails({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	const [pin, currentUser, comments] = await Promise.all([
		getPinDetailAction(id),
		getCurrentUser(),
		getCommentsAction({ pin_id: id })
	])

	if (isActionError(pin)) {
		return (
			<div className="flex items-center justify-center mt-8">
				<h1 className="text-2xl font-semibold">{pin.error.includes('not found') ? 'Pin not found' : 'Something went wrong'}</h1>
			</div>
		)
	}

	const user = await (await clerkClient()).users.getUser(pin.user_id)

	let isFollowing = false
	let boardsDropdown: ServerActionResponse<Board[]> = []
	if (currentUser) {
		boardsDropdown = await getBoardsAction({ user_id: currentUser.id })
		if (
			(await checkFollowAction({ followerId: currentUser.id, followingId: user.id })) &&
			currentUser.id !== user.id
		) {
			isFollowing = true
		}
	}

	if (isActionError(boardsDropdown) || isActionError(comments)) {
		return (
			<div>
				<h1>Something went wrong</h1>
			</div>
		)
	}

	return (
		<div className="min-h-screen">
			<div className="flex items-center justify-center py-4">
				<div className="grid w-full items-stretch max-w-5xl grid-cols-1 gap-4 rounded-2xl dark:bg-darkbg p-4 shadow-2xl lg:grid-cols-[500px,1fr]">
					{/* Left: Image Section */}
					<div className="relative">
						<div className="relative w-full overflow-hidden rounded-lg">
							<Image
								src={pin.url}
								alt="Detailed landscape artwork"
								width={500}
								height={500}
								className="h-auto w-full max-h-[600px] object-fill"
								priority
							/>
							<ExpandButton imageUrl={pin.url} />
						</div>
					</div>

					{/* Right: Info Section */}
					<div className="flex flex-col">
						{/* Top Actions */}
						<div className="flex items-center justify-between pb-4">
							<div className="flex items-center gap-2">
								<div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-2">
									<Heart className="h-5 w-5" />
									<span className="text-sm font-medium">30</span>
								</div>
								<Button size="icon" variant="secondary" className="rounded-full">
									<Share2 className="h-5 w-5" />
								</Button>
								<PinActions pinId={pin._id} pinUrl={pin.url}>
									<Button size="icon" variant="secondary" className="rounded-full">
										<MoreHorizontal className="h-5 w-5" />
									</Button>
								</PinActions>
							</div>
							<div className="flex items-center gap-2">
								<BoardDropdown mode="save" pin={pin} boardsDropdown={boardsDropdown} />
							</div>
						</div>

						{/* Title */}
						<div>
							{pin.title && <h1 className="text-2xl font-semibold break-all">{pin.title}</h1>}
							{pin.description && (
								<p className="text-sm text-muted-foreground break-all">{pin.description}</p>
							)}
							{pin.referenceLink && (
								<Link
									href={pin.referenceLink}
									className="text-sm text-blue-600 break-all hover:underline"
									target="_blank"
									rel="noopener noreferrer"
								>
									{pin.referenceLink}
								</Link>
							)}
						</div>

						{/* User Info */}
						<div className="flex items-center justify-between py-4">
							<Link href={`/user/${user.username}`}>
								<div className="flex items-center gap-2">
									<Avatar>
										<AvatarImage src={user.imageUrl} alt="Avatar" />
										<AvatarFallback>{user.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
									</Avatar>
									<div>
										<h2 className="font-medium">{user.fullName}</h2>
										<p className="text-sm text-muted-foreground">
											{(user.unsafeMetadata.followerCount as number) || 0} followers
										</p>
									</div>
								</div>
							</Link>
							{user.id !== currentUser?.id && (
								<FollowButton isFollowing={isFollowing} followingId={user.id} />
							)}
						</div>

						{/* Comments Section */}
						<CommentSection isAllowedComment={pin.isAllowedComment} initialComments={comments} />
					</div>
				</div>
			</div>
			<FullScreenViewModal />
		</div>
	)
}
