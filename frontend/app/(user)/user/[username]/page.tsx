import { Board, getBoardsAction } from '@/actions/board-actions'
import { getAllFollowsAction } from '@/actions/follow-actions'
import { getAllPinsUserAction } from '@/actions/pin-actions'
import BoardPreviewList from '@/components/board-preview-list'
import FollowModal from '@/components/modals/follow-modal'
import PinList from '@/components/pin-list'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import UserStats from '@/components/user-stats'
import { isActionError, ServerActionResponse } from '@/lib/errors'
import currentUser from '@/lib/get-current-user'
import { clerkClient } from '@clerk/nextjs/server'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export const generateMetadata = async ({ params }: { params: Promise<{ username: string }> }) => {
	const { username } = await params
	return {
		title: `Snapsphere | ${username}`
	}
}

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
	const { username } = await params

	const {
		data: [user]
	} = await (await clerkClient()).users.getUserList({ username: [username] })

	if (!user) {
		return (
			<div className="flex items-center justify-center mt-20">
				<div className="text-center">
					<h2 className="text-2xl font-semibold mb-2">User Not Found</h2>
					<p className="text-muted-foreground">The requested user profile does not exist.</p>
				</div>
			</div>
		)
	}

	let boardsDropdown: ServerActionResponse<Board[]> = []

	const [loginedUser, pins, boardsPreview, followers, following] = await Promise.all([
		currentUser(),
		getAllPinsUserAction({ user_id: user.id }),
		getBoardsAction({ user_id: user.id }),
		getAllFollowsAction({ followingId: user.id }),
		getAllFollowsAction({ followerId: user.id })
	])

	if (loginedUser) {
		boardsDropdown = await getBoardsAction({ user_id: loginedUser.id })
	}

	if (
		isActionError(pins) ||
		isActionError(boardsDropdown) ||
		isActionError(boardsPreview) ||
		isActionError(followers) ||
		isActionError(following)
	) {
		return (
			<div className="flex items-center justify-center mt-20">
				<div className="text-center">
					<h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
				</div>
			</div>
		)
	}

	return (
		<>
			<div className="min-h-screen bg-background pb-8">
				{/* Profile Header */}
				<UserStats
					user={JSON.parse(JSON.stringify(user))}
					followers={followers.length}
					following={following.length}
				/>

				{/* Tabs */}
				<Tabs defaultValue="saved" className="px-4">
					<div className="flex items-center justify-center border-b">
						<TabsList className="h-16 w-[200px] grid grid-cols-2 gap-2 bg-transparent">
							<TabsTrigger
								value="created"
								className="border h-10 rounded-2xl hover:bg-muted data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
							>
								Created
							</TabsTrigger>
							<TabsTrigger
								value="saved"
								className="border h-10 rounded-2xl hover:bg-muted data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
							>
								Saved
							</TabsTrigger>
						</TabsList>
					</div>

					<TabsContent forceMount value="created" className="mt-6 data-[state=inactive]:hidden">
						{loginedUser!.username === username && pins.length === 0 && (
							<div className="max-w-[200px] mx-auto">
								<Link href={`/create`}>
									<button className="group relative aspect-square w-full overflow-hidden rounded-2xl border-2 border-dashed border-muted hover:border-muted-foreground">
										<div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
											<div className="rounded-full bg-muted p-4 group-hover:bg-muted-foreground/20">
												<Plus className="h-6 w-6 text-muted-foreground" />
											</div>
											<span className="text-sm font-medium">Create pin</span>
										</div>
									</button>
								</Link>
							</div>
						)}
						<PinList pageName='User' initialPins={pins} boardsDropdown={boardsDropdown} />
					</TabsContent>

					<TabsContent forceMount value="saved" className="mt-2 data-[state=inactive]:hidden">
						<BoardPreviewList initBoardsPreview={boardsPreview} userId={user.id} username={username} />
					</TabsContent>
				</Tabs>
			</div>
			<FollowModal userId={user.id} followers={followers} following={following} />
		</>
	)
}
