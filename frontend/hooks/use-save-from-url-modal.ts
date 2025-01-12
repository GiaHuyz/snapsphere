import { create } from 'zustand'

interface SaveFromUrlModalProps {
	isOpen: boolean
	onClose: () => void
	onOpen: () => void
}

export const useSaveFromUrlModal = create<SaveFromUrlModalProps>((set) => ({
	isOpen: false,
	onClose: () => set({ isOpen: false }),
	onOpen: () => set({ isOpen: true })
}))
