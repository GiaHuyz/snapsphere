import { create } from 'zustand'

interface FollowModalStore {
	isOpen: boolean
	type: 'followers' | 'following' | null
	userId: string | null
	onOpen: (type: 'followers' | 'following', userId: string) => void
	onClose: () => void
}

export const useFollowModal = create<FollowModalStore>((set) => ({
	isOpen: false,
	type: null,
	userId: null,
	onOpen: (type, userId) => set({ isOpen: true, type, userId }),
	onClose: () => set({ isOpen: false, type: null, userId: null })
}))

