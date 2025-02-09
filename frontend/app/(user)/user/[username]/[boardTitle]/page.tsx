import { getBoardsAction } from '@/actions/board-actions'
import { getPinsByBoardIdAction } from '@/actions/pin-actions'
import BoardHeader from '@/components/pages/board-detail/board-header'
import PinList from '@/components/pin/pin-list'
import { isActionError } from '@/lib/errors'
import { auth, clerkClient } from '@clerk/nextjs/server'

export const generateMetadata = async ({ params }: { params: Promise<{ username: string; boardTitle: string }> }) => {
	const paramsString = await params
	const username = paramsString.username
	let boardTitle = paramsString.boardTitle

	boardTitle = boardTitle.replace(/%20/g, ' ')
	return {
		title: `Snapsphere | ${username} | ${boardTitle}`
	}
}

export default async function BoardPage({ params }: { params: Promise<{ username: string; boardTitle: string }> }) {
	const paramsString = await params
	const username = paramsString.username
	let boardTitle = paramsString.boardTitle

	boardTitle = boardTitle.replace(/%20/g, ' ')

	const {
		data: [user]
	} = await (await clerkClient()).users.getUserList({ username: [username] })

	if (!user) {
		return (
			<div className="text-center mt-8">
				<h2 className="text-2xl font-semibold">User not found</h2>
			</div>
		)
	}

	const boards = await getBoardsAction({ user_id: user.id, title: boardTitle })

	if (isActionError(boards)) {
		return (
			<div className="text-center mt-8">
				<h2 className="text-2xl font-semibold">Something went wrong</h2>
			</div>
		)
	}

	if (boards.data.length === 0) {
		return (
			<div className="text-center mt-8">
				<h2 className="text-2xl font-semibold">Board not found</h2>
			</div>
		)
	}

	const { userId } = await auth()

	const board = boards.data[0]
	const pins = await getPinsByBoardIdAction({ board_id: board._id })

	if (isActionError(pins)) {
		return (
			<div>
				<h1>Something went wrong</h1>
			</div>
		)
	}

	return (
		<>
			<div className="container mx-auto px-4 py-8">
				<BoardHeader initBoard={board} user={JSON.parse(JSON.stringify(user))} isOwner={userId === user.id} />
			</div>
			<div className="mt-8">
				<PinList pageName="BoardDetail" boardId={board._id} initialPins={pins} />
			</div>
		</>
	)
}
