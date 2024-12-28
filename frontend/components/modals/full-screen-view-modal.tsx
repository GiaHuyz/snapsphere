'use client'

import { Button } from '@/components/ui/button'
import { useFullScreenModal } from '@/hooks/use-full-screen-modal'
import { X } from 'lucide-react'
import Image from 'next/image'
import { SyntheticEvent, useState } from 'react'

export default function FullScreenViewModal() {
	const { imageUrl, onClose, isOpen } = useFullScreenModal()
	const [imageWidth, setImageWidth] = useState(640)

	const handleImageLoad = (e: SyntheticEvent<HTMLImageElement, Event>) => {
		const { naturalWidth, naturalHeight } = e.target as HTMLImageElement
		const aspectRatio = naturalWidth / naturalHeight

		if (aspectRatio < 1) {
			setImageWidth(640)
		} else if (aspectRatio > 1) {
			setImageWidth(1200)
		} else {
            setImageWidth(850)
        }
	}

	if (!isOpen) return null

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
			<Button
				variant="ghost"
				size="icon"
				className="absolute top-4 right-4 bg-white dark:bg-slate-800 hover:bg-white/90 hover:dark:bg-slate-800/90 rounded-full"
				onClick={onClose}
			>
				<X className="h-4 w-4" />
			</Button>
			<div onClick={(e) => e.stopPropagation()}>
				<Image
					src={imageUrl}
					alt="Expanded view"
					width={imageWidth}
					height={850}
					className="max-h-[calc(100vh-32px)] max-w-[calc(100vw-32px)] min-w-60 object-fill rounded-2xl"
					priority
					onLoad={handleImageLoad}
				/>
			</div>
		</div>
	)
}
