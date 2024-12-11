import { Board } from '@/actions/board-actions'
import { createStore } from 'zustand'

export type BoardDropdownProps = {
	boardsDropdown: Board[]
}

type BoardDropdownStore = BoardDropdownProps & {
	setBoardsDropdown: (boards: Board[]) => void
}

export const createBoardDropdownStore = (initProps?: Partial<BoardDropdownProps>) => {
	const DEFAULT_PROPS: BoardDropdownProps = {
		boardsDropdown: []
	}
	return createStore<BoardDropdownStore>()((set) => ({
		...DEFAULT_PROPS,
		...initProps,
		setBoardsDropdown: (boards: Board[]) => set({ boardsDropdown: boards })
	}))
}
