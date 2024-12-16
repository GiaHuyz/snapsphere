'use client'

import BoardPreview from '@/components/board-preview'
import { useBoardPreviewStore } from '@/provider/board-preview-provider'

export default function BoardPreviewList({ username }: { username: string }) {
	const { boardPreview } = useBoardPreviewStore()

	return (
		<div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6 mt-6">
			{boardPreview.map((board) => (
				<BoardPreview key={board._id} {...board} username={username}/>
			))}
		</div>
	)
}
