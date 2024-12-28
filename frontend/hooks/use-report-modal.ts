import { create } from 'zustand'

interface ReportModalStore {
	isOpen: boolean
	itemId: string | null
	itemType: 'pin' | 'user' | 'comment' | null
	onOpen: (itemId: string, itemType: 'pin' | 'user' | 'comment') => void
	onClose: () => void
}

export const useReportModal = create<ReportModalStore>((set) => ({
	isOpen: false,
	itemId: null,
	itemType: null,
	onOpen: (itemId, itemType) => set({ isOpen: true, itemId, itemType }),
	onClose: () => set({ isOpen: false, itemId: null, itemType: null })
}))

