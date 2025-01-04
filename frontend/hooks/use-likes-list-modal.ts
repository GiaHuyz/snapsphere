import { create } from 'zustand'

interface LikesListModalStore {
	isOpen: boolean
	pinId: string | null
	onOpen: (pinId: string) => void
	onClose: () => void
}

export const useLikesListModal = create<LikesListModalStore>((set) => ({
	isOpen: false,
	pinId: null,
	onOpen: (pinId) => set({ isOpen: true, pinId }),
	onClose: () => set({ isOpen: false, pinId: null })
}))
