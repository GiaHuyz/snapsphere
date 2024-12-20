'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useUploadImageModal } from '@/hooks/use-upload-image-modal'
import { ImageUp } from 'lucide-react'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'sonner'

export default function UploadImageModal() {
	const { setUploadImage, setImageFile, isOpen, onClose } = useUploadImageModal()

	const handleImageUpload = useCallback(
		(file: File) => {
            if (file.size > 10 * 1024 * 1024) {
                toast.error('Image too large. Please upload an image less than 10 MB in size.')
                return
            }
            
			const imageUrl = URL.createObjectURL(file)
			const img = new Image()
			img.src = imageUrl

			img.onload = () => {
				if (img.naturalWidth < 150 || img.naturalHeight < 150) {
					toast.error('Image too small. Please upload an image with a minimum size of 150x150.')
					return
				}

				const fixedHeight = 150
				const scaledWidth = (img.naturalWidth / img.naturalHeight) * fixedHeight

				setUploadImage({
					url: imageUrl,
					width: scaledWidth,
					height: fixedHeight
				})
			}
		},
		[setUploadImage]
	)

	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			const file = acceptedFiles[0]
			if (file) {
				handleImageUpload(file)
                setImageFile(file)
				onClose()
			}
		},
		[onClose, handleImageUpload, setImageFile]
	)

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			'image/*': []
		},
		maxFiles: 1
	})

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Upload a photo</DialogTitle>
				</DialogHeader>
				<div
					{...getRootProps()}
					className={`mt-4 flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed ${
						isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
					}`}
				>
					<input {...getInputProps()} />
					<div className="flex flex-col items-center gap-2 p-4 text-center">
						<ImageUp className="h-8 w-8 text-muted-foreground" />
						<p className="text-sm text-muted-foreground">Choose an image or drag and drop it here</p>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
