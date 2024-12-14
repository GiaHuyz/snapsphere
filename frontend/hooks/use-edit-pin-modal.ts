import { Pin } from '@/actions/pin-actions'
import { Dispatch, SetStateAction } from 'react'
import { create } from 'zustand'

interface EditPinModalStore {
	isOpen: boolean
	pin: Pin | null
	mutatePinsFn: Dispatch<SetStateAction<Pin[]>>
	onOpen: (pin: Pin) => void
    setMutatePinsFn: (mutatePinsFn: Dispatch<SetStateAction<Pin[]>>) => void
	onClose: () => void
}

export const useEditPinModal = create<EditPinModalStore>((set) => ({
	isOpen: false,
	pin: null,
    mutatePinsFn: () => {},
	onOpen: (pin) => set({ isOpen: true, pin }),
	onClose: () => set({ isOpen: false, pin: null }),
    setMutatePinsFn: (mutatePinsFn) => set({ mutatePinsFn }),
}))
