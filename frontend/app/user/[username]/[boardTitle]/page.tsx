import { Board, getBoardsAction } from '@/actions/board-actions'
import { getPinsByBoardIdAction, Pin as PinType } from '@/actions/pin-actions'
import BoardHeader from '@/components/board-header'
import MansoryLayout from '@/components/mansory-layout'
import EditPinModal from '@/components/modals/edit-pin-modal'
import Pin from '@/components/pin'
import { isActionError, ServerActionResponse } from '@/lib/errors'
import { auth, clerkClient } from '@clerk/nextjs/server'

export default async function BoardPage({ params }: { params: { username: string; boardTitle: string } }) {
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

	if (boards.length === 0) {
		return (
			<div className="text-center mt-8">
				<h2 className="text-2xl font-semibold">Board not found</h2>
			</div>
		)
	}

	const { userId } = await auth()

	let boardsDropdown: ServerActionResponse<Board[]> = []
	if (userId) {
		boardsDropdown = await getBoardsAction({ user_id: userId })
		if (isActionError(boardsDropdown)) {
			return (
				<div>
					<h1>Something went wrong</h1>
				</div>
			)
		}
	}

	const board = boards[0]
	const pins = await getPinsByBoardIdAction(board._id)

	return (
		<>
			<div className="container mx-auto px-4 py-8">
				<BoardHeader board={board} user={JSON.parse(JSON.stringify(user))} isOwner={userId === user.id} />
			</div>
			<div className="mt-8">
				<MansoryLayout className="xl:columns-6">
					{(pins as unknown as { pin_id: PinType }[]).map(({ pin_id: pin }) => (
						<Pin key={pin._id} pin={pin} boardsDropdown={boardsDropdown} />
					))}
				</MansoryLayout>
			</div>
			<EditPinModal boardsDropdown={boardsDropdown} />
		</>
	)
}
