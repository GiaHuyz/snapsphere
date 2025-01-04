import { Board } from '@/actions/board-actions'
import { create } from 'zustand'

interface BoardDetailStore {
	board: Board
	setBoard: (board: Board) => void
}

export const useBoardDetailStore = create<BoardDetailStore>((set) => ({
	board: {} as Board,
	setBoard: (board: Board) => set({ board })
}))
