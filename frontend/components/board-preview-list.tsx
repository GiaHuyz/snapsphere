import { Board } from '@/actions/board-actions'
import BoardPreview from '@/components/board-preview'

export default function BoardPreviewList({ boardsPreview, username }: { boardsPreview: Board[]; username: string }) {
	return (
		<div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6 mt-6">
			{boardsPreview.map((board) => (
				<BoardPreview key={board._id} {...board} username={username} />
			))}
		</div>
	)
}
