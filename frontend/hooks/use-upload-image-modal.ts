import { create } from 'zustand'

interface UploadImage {
	url: string
	width: number
	height: number
}

interface UseUploadImageModalStore {
	isOpen: boolean
	upLoadImage: UploadImage | null
	onOpen: () => void
	onClose: () => void
	setUploadImage: (image: UploadImage | null) => void
}

export const useUploadImageModal = create<UseUploadImageModalStore>((set) => ({
	isOpen: false,
	upLoadImage: null,
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false }),
	setUploadImage: (image) => set({ upLoadImage: image })
}))
