'use client'

import { toast } from '@/hooks/use-toast'
import { ChangeEvent, useState } from 'react'

const usePreviewAvatarImage = () => {
	const [previewImage, setPreviewImage] = useState<string | null>(null)

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file && file.type.startsWith('image')) {
			const maxSize = 10 * 1024 * 1024 // 10 MB in bytes
			if (file.size > maxSize) {
				toast({
					title: 'Image too large',
					description: 'Please select an image file that is less than 10 MB in size.',
					variant: 'destructive'
				})
				return
			}

			const reader = new FileReader()
			reader.onload = () => {
				setPreviewImage(reader.result as string)
			}
			reader.readAsDataURL(file)
		} else {
			toast({
				title: 'Invalid file type',
				description: 'Please select an image file',
				variant: 'destructive'
			})
		}
	}

	return { previewImage, handleFileChange }
}

export default usePreviewAvatarImage
