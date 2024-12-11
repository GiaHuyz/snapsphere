'use client'

import { Board } from '@/actions/board-actions'
import BoardPreview from '@/components/board-preview'
import { useEditBoardModal } from '@/hooks/use-edit-board-modal'
import { useEffect, useState } from 'react'

export default function BoardPreviewList({ username, initBoards }: { username: string; initBoards: Board[] }) {
	const [boards, setBoards] = useState(initBoards)
	const { setMutateBoardsFn } = useEditBoardModal()

	useEffect(() => {
		setBoards(initBoards)
		setMutateBoardsFn(setBoards)
	}, [initBoards, setBoards, setMutateBoardsFn])

	return (
		<div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6 mt-6">
			{boards.map((board) => (
				<BoardPreview key={board._id} {...board} username={username} />
			))}
		</div>
	)
}
