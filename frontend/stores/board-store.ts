import { Board } from '@/actions/board-actions'
import { createStore } from 'zustand'

export type BoardProps = {
	boardsDropdown: Board[]
    boardPreviews: Board[]
}

type BoardStore = BoardProps & {
	setBoardsDropdown: (boards: Board[]) => void
	setBoardPreviews: (boards: Board[]) => void
}

export const createBoardStore = (initProps?: Partial<BoardProps>) => {
    const DEFAULT_PROPS: BoardProps = {
        boardsDropdown: [],
        boardPreviews: []
    }
	return createStore<BoardStore>()((set) => ({
		...DEFAULT_PROPS,
        ...initProps,
		setBoardsDropdown: (boards: Board[]) => set({ boardsDropdown: boards }),
		setBoardPreviews: (boards: Board[]) => set({ boardPreviews: boards }),
	}))
}
