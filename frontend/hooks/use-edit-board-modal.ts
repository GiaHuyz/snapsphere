import { Board } from '@/actions/board-actions'
import { create } from 'zustand'

interface EditBoardStore {
	isOpen: boolean
	boardId: string | null
	boardData: {
		title: string
		description?: string
		coverImage?: string
		secret: boolean
	} | null
    setBoards: (boards: Board[]) => void
	onOpen: (
		boardId: string,
		data: { title: string; description?: string; coverImage?: string; secret: boolean },
		setBoards: (boards: Board[]) => void
	) => void
	onClose: () => void
}

export const useEditBoardModal = create<EditBoardStore>((set) => ({
	isOpen: false,
	boardId: null,
	boardData: null,
	setBoards: () => {},
	onOpen: (boardId, data, setBoards) => set({ isOpen: true, boardId, boardData: data, setBoards }),
	onClose: () => set({ isOpen: false, boardId: null, boardData: null }),
}))
