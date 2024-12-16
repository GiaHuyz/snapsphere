import { Pin } from '@/actions/pin-actions'
import { create } from 'zustand'

interface EditPinModalStore {
	isOpen: boolean
	pin: Pin | null
	onOpen: (pin: Pin) => void
	onClose: () => void
}

export const useEditPinModal = create<EditPinModalStore>((set) => ({
	isOpen: false,
	pin: null,
	onOpen: (pin) => set({ isOpen: true, pin }),
	onClose: () => set({ isOpen: false, pin: null }),
}))
