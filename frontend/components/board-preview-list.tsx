'use client'

import BoardPreview from '@/components/board-preview'
import { useBoardStore } from '@/provider/board-provider'

export default function BoardPreviewList({ username }: { username: string }) {
	const { boardPreviews } = useBoardStore()

	return (
		<div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6">
			{boardPreviews.map((board) => (
				<BoardPreview key={board.id} {...board} username={username} />
			))}
		</div>
	)
}
