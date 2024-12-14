'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useUploadImageModal } from '@/hooks/use-upload-image-modal'
import { ImageUp } from 'lucide-react'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

export default function UploadImageModal() {
	const { setUploadImage, isOpen, onClose } = useUploadImageModal()

    const handleImageUpload = useCallback(
        (file: File) => {
            const imageUrl = URL.createObjectURL(file)
            const img = new Image()
            img.src = imageUrl

            img.onload = () => {
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
				onClose()
			}
		},
		[onClose, handleImageUpload]
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
