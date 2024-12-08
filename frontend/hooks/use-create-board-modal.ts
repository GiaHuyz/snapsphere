import { create } from 'zustand'

interface UseCreateBoardModalStore {
	isOpen: boolean
	image: string
	onOpen: () => void
	onClose: () => void
	setImage: (image: string) => void
}

export const useCreateBoardModal = create<UseCreateBoardModalStore>((set) => ({
	isOpen: false,
	image: '',
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false }),
	setImage: (image: string) => set({ image })
}))
