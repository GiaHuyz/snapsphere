import { getCommentsAction } from '@/actions/comment-action'
import { checkFollowAction } from '@/actions/follow-actions'
import { getPinDetailAction, getSimilarPinsAction } from '@/actions/pin-actions'
import FollowButton from '@/components/follow-button'
import FullScreenViewModal from '@/components/modals/full-screen-view-modal'
import { CommentSection } from '@/components/pages/pin-detail/comment-section'
import ExpandButton from '@/components/pages/pin-detail/expand-button'
import PinDetailTopActions from '@/components/pages/pin-detail/pin-detail-top-actions'
import PinList from '@/components/pin/pin-list'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { isActionError } from '@/lib/errors'
import getCurrentUser from '@/lib/get-current-user'
import { clerkClient } from '@clerk/nextjs/server'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PAGE_SIZE_PINS } from '@/lib/constants'

export const metadata: Metadata = {
	title: 'Snapsphere | Pin'
}

export default async function PinDetails({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	const [pin, currentUser, comments, similarPins] = await Promise.all([
		getPinDetailAction(id),
		getCurrentUser(),
		getCommentsAction({ pin_id: id }),
		getSimilarPinsAction({ pinId: id, page: 1, pageSize: PAGE_SIZE_PINS })
	])

	if (isActionError(pin)) {
		return (
			<div className="flex items-center justify-center mt-8">
				<h1 className="text-2xl font-semibold">
					{pin.error.includes('not found') ? 'Pin not found' : 'Something went wrong'}
				</h1>
			</div>
		)
	}

	const user = await (await clerkClient()).users.getUser(pin.user_id)

	let isFollowing = false
	if (currentUser) {
		if (
			(await checkFollowAction({ followerId: currentUser.id, followingId: user.id })) &&
			currentUser.id !== user.id
		) {
			isFollowing = true
		}
	}

	if (isActionError(comments)) {
		return (
			<div className="flex items-center justify-center mt-8">
				<h1 className="text-2xl font-semibold">Something went wrong</h1>
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
						<PinDetailTopActions pin={pin} />

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
						<CommentSection isAllowedComment={pin.isAllowedComment} initialComments={comments} pinUserId={pin.user_id} />
					</div>
				</div>
			</div>
			{/* Similar Pins Section */}
			{!isActionError(similarPins) && similarPins.length > 0 && (
				<div className="mt-6">
					<h2 className="text-2xl font-semibold mb-4 text-center">More like this</h2>
					<PinList initialPins={similarPins} pageName="Similar" pinId={pin._id} />
				</div>
			)}
			<FullScreenViewModal />
		</div>
	)
}
