import { create } from 'zustand'

interface PinTransModalStore {
	isOpen: boolean
	imageFile: File | null
	imagePreview: string | null
    currentImage: string | null
	onOpen: () => void
	onClose: () => void
	setImagePreview: (preview: string | null) => void
    setCurrentImage: (currentImage: string | null) => void
    setImageFile: (image: File | null) => void
}

export const usePinTransModal = create<PinTransModalStore>((set) => ({
	isOpen: false,
	imageFile: null,
	imagePreview: null,
	currentImage: null,
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false }),
    setImagePreview: (preview) => set({ imagePreview: preview }),
    setCurrentImage: (currentImage) => set({ currentImage }),
    setImageFile: (imageFile) => set({ imageFile })
}))
