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
	onOpen: (
		boardId: string,
		data: { title: string; description?: string; coverImage?: string; secret: boolean }
	) => void
	onClose: () => void
}

export const useEditBoardModal = create<EditBoardStore>((set) => ({
	isOpen: false,
	boardId: null,
	boardData: null,
	onOpen: (boardId, data) => set({ isOpen: true, boardId, boardData: data }),
	onClose: () => set({ isOpen: false, boardId: null, boardData: null })
}))
