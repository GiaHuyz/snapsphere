import { create } from "zustand"

interface FullScreenModalStore {
    isOpen: boolean
    imageUrl: string
    onOpen: (imageUrl: string) => void
    onClose: () => void
}

export const useFullScreenModal = create<FullScreenModalStore>((set) => ({
    isOpen: false,
    imageUrl: '',
    onOpen: (imageUrl) => set({ isOpen: true, imageUrl }),
    onClose: () => set({ isOpen: false }),
}))

