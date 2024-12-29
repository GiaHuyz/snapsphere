import { getBoardsAction } from '@/actions/board-actions'
import { getAllPinsUserAction } from '@/actions/pin-actions'
import PinList from '@/components/pin-list'
import { isActionError } from '@/lib/errors'
import { auth } from '@clerk/nextjs/server'

export default async function HomePage() {
	const { userId } = await auth()

	const [pins, boardsDropdown] = await Promise.all([getAllPinsUserAction({}), getBoardsAction({ user_id: userId! })])

	if (isActionError(pins) || isActionError(boardsDropdown)) {
		return (
			<div>
				<h1>Something went wrong</h1>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-background">
			<div className="py-6">
				<PinList pageName='Home' initialPins={pins} boardsDropdown={boardsDropdown} />
			</div>
		</div>
	)
}
