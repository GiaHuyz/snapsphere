import { create } from 'zustand'

interface UseCreateBoardModalStore {
	isOpen: boolean
	pin: {
		_id?: string
		url: string
	} | null
	onOpen: () => void
	onClose: () => void
	setPin: (pin: { _id?: string; url: string }) => void
}

export const useCreateBoardModal = create<UseCreateBoardModalStore>((set) => ({
	isOpen: false,
	pin: null,
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false, pin: null }),
	setPin: (pin) => set({ pin })
}))
