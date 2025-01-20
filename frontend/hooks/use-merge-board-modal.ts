import { Board } from '@/actions/board-actions'
import { create } from 'zustand'

interface MergeBoardModalStore {
	isOpen: boolean
	currentBoard: Board
	onOpen: (currentBoard: Board) => void
	onClose: () => void
}

export const useMergeBoardModal = create<MergeBoardModalStore>((set) => ({
	isOpen: false,
	currentBoard: {} as Board,
	onOpen: (currentBoard: Board) => set({ isOpen: true, currentBoard }),
	onClose: () => set({ isOpen: false }),
}))
