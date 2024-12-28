import { Board } from '@/actions/board-actions'
import { create } from 'zustand'

interface EditBoardStore {
	isOpen: boolean
	boardId: string | null
	boardData: Board | null
	onOpen: (boardId: string, data: Board) => void
	onClose: () => void
}

export const useEditBoardModal = create<EditBoardStore>((set) => ({
	isOpen: false,
	boardId: null,
	boardData: null,
	onOpen: (boardId, data) => set({ isOpen: true, boardId, boardData: data }),
    onClose: () => set({ isOpen: false, boardId: null, boardData: null }),
}))
