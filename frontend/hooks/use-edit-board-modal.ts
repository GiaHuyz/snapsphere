import { Board } from '@/actions/board-actions'
import { Dispatch, SetStateAction } from 'react'
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
    mutateBoardsFn: Dispatch<SetStateAction<Board[]>>
	onOpen: (
		boardId: string,
		data: { title: string; description?: string; coverImage?: string; secret: boolean }
	) => void
	onClose: () => void
    setMutateBoardsFn: (mutateBoardsFn: Dispatch<SetStateAction<Board[]>>) => void
}

export const useEditBoardModal = create<EditBoardStore>((set) => ({
	isOpen: false,
	boardId: null,
	boardData: null,
	mutateBoardsFn: () => {},
	onOpen: (boardId, data) => set({ isOpen: true, boardId, boardData: data }),
	onClose: () => set({ isOpen: false, boardId: null, boardData: null }),
	setMutateBoardsFn: (mutateBoardsFn) => set({ mutateBoardsFn }),
}))
