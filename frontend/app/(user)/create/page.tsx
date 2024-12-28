import { getBoardsAction } from '@/actions/board-actions'
import CreatePinForm from '@/components/create-pin-form'
import { isActionError } from '@/lib/errors'
import { auth } from '@clerk/nextjs/server'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Snapsphere | Create Pin'
}

export default async function CreatePinPage() {
	const { userId } = await auth()
	const boardsDropdown = await getBoardsAction({ user_id: userId! })

	if (isActionError(boardsDropdown)) {
		return (
			<div>
				<h1>Something went wrong</h1>
				<p>{boardsDropdown.error}</p>
			</div>
		)
	}

	return (
		<div className="container max-w-4xl py-8 px-3 mx-auto">
			<div className="space-y-6">
				<h1 className="text-2xl font-bold text-center">Create Pin</h1>
				<CreatePinForm boardsDropdown={boardsDropdown} />
			</div>
		</div>
	)
}
