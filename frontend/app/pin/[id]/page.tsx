import { getBoardsByUsernameAction } from '@/actions/board-actions'
import { getPinDetailAction } from '@/actions/pin-actions'
import BoardDropdown from '@/components/board-dropdown'
import { CommentInput } from '@/components/comment-input'
import ExpandButton from '@/components/expand-button'
import FullScreenViewModal from '@/components/modals/full-screen-view-modal'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { isActionError } from '@/lib/errors'
import { clerkClient } from '@clerk/nextjs/server'
import { Heart, MoreHorizontal, Share2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default async function PinDetails({ params }: { params: { id: string } }) {
	const { id } = params
	const pin = await getPinDetailAction(id)

	if (isActionError(pin)) {
		return (
			<div>
				<h1>Something went wrong</h1>
				<p>{pin.error}</p>
			</div>
		)
	}

	const user = await (await clerkClient()).users.getUser(pin.user_id)
	const boardsDropdown = await getBoardsByUsernameAction(user?.id)

	if (isActionError(boardsDropdown)) {
		return (
			<div>
				<h1>Something went wrong</h1>
				<p>{boardsDropdown.error}</p>
			</div>
		)
	}

	return (
		<div className="min-h-screen">
			<div className="flex items-center justify-center py-8">
				<div className="grid w-full max-w-5xl grid-cols-1 gap-4 rounded-2xl bg-white p-4 shadow-2xl lg:grid-cols-[500px,1fr]">
					{/* Left: Image Section */}
					<div className="relative">
						<div className="relative w-full overflow-hidden rounded-lg">
							<Image
								src={pin.url}
								alt="Detailed landscape artwork"
								width={500}
								height={500}
								className="h-auto w-full max-h-[685px] object-cover"
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
								<Button size="icon" variant="secondary" className="rounded-full">
									<MoreHorizontal className="h-5 w-5" />
								</Button>
							</div>
							<div className="flex items-center gap-2">
								<BoardDropdown mode="save" pin={pin} boardsDropdown={boardsDropdown} />
							</div>
						</div>

						{/* Title */}
						{pin.title && <h2 className="text-2xl font-semibold break-all">{pin.title}</h2>}

						{/* User Info */}
						<div className="flex items-center justify-between py-4">
							<Link href={`/${user.username}`}>
								<div className="flex items-center gap-2">
									<Avatar>
										<AvatarImage src={user.imageUrl} alt="Avatar" />
										<AvatarFallback>MH</AvatarFallback>
									</Avatar>
									<div>
										<h2 className="font-medium">{user.fullName}</h2>
										<p className="text-sm text-muted-foreground">1k followers</p>
									</div>
								</div>
							</Link>
							<Button variant="outline" className="rounded-full">
								Follow
							</Button>
						</div>

						{/* Comments Section */}
						<div className="flex-1 overflow-y-auto">
							<h3 className="font-medium">No comments yet</h3>
							<p className="text-sm text-muted-foreground">
								No comments yet! Add one to start the conversation.
							</p>
						</div>

						{/* Comment Input */}
						<div className="pt-4">
							<CommentInput />
						</div>
					</div>
				</div>
			</div>
			<FullScreenViewModal />
		</div>
	)
}
