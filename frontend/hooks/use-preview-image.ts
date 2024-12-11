'use client'

import { ChangeEvent, useState } from 'react'
import { toast } from 'sonner'

const usePreviewAvatarImage = () => {
	const [previewImage, setPreviewImage] = useState<string | null>(null)

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file && file.type.startsWith('image')) {
			const maxSize = 10 * 1024 * 1024 // 10 MB in bytes
			if (file.size > maxSize) {
				toast.error('File size too large. Please select an image less than 10 MB in size.')
				return
			}

			const reader = new FileReader()
			reader.onload = () => {
				setPreviewImage(reader.result as string)
			}
			reader.readAsDataURL(file)
		} else {
			toast.error('Please select an image file.')
		}
	}

	return { previewImage, handleFileChange }
}

export default usePreviewAvatarImage
