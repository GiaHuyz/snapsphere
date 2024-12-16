import { Board } from '@/actions/board-actions'
import { createStore } from 'zustand'

export type BoardPreviewProps = {
	boardPreview: Board[]
}

type BoardPreviewStore = BoardPreviewProps & {
	setBoardPreview: (boards: Board[]) => void
}

export const createBoardPreviewStore = (initProps?: Partial<BoardPreviewProps>) => {
	const DEFAULT_PROPS: BoardPreviewProps = {
		boardPreview: []
	}
	return createStore<BoardPreviewStore>()((set) => ({
		...DEFAULT_PROPS,
		...initProps,
		setBoardPreview: (boards: Board[]) => set({ boardPreview: boards })
	}))
}
