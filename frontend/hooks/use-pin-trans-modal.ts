import { create } from 'zustand'

interface PinTransModalStore {
	isOpen: boolean
	imageFile: File | null
	imagePreview: string | null
    currentImage: string | null
	onOpen: (image: File | null) => void
	onClose: () => void
	setImagePreview: (preview: string | null) => void
    setCurrentImage: (currentImage: string | null) => void
}

export const usePinTransModal = create<PinTransModalStore>((set) => ({
	isOpen: false,
	imageFile: null,
	imagePreview: null,
	currentImage: null,
	onOpen: (imageFile) => set({ isOpen: true, imageFile }),
	onClose: () => set({ isOpen: false, imageFile: null }),
    setImagePreview: (preview) => set({ imagePreview: preview }),
    setCurrentImage: (currentImage) => set({ currentImage }),
}))
