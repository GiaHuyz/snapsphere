'use client'

import { Button } from "@/components/ui/button"
import { useFullScreenModal } from "@/hooks/use-full-screen-modal"
import { X } from "lucide-react"
import Image from "next/image"

export default function FullScreenViewModal() {
    const { imageUrl, onClose, isOpen } = useFullScreenModal()

    if(!isOpen) return null

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
			<Button
				variant="ghost"
				size="icon"
				className="absolute top-4 right-4 bg-white hover:bg-white/90 rounded-full"
				onClick={onClose}
			>
				<X className="h-4 w-4" />
			</Button>
			<div className="relative" onClick={(e) => e.stopPropagation()}>
				<Image
					src={imageUrl}
					alt="Expanded view"
					width={1200}
					height={800}
					className="max-h-[90vh] max-w-[90vw] w-auto min-w-60 object-fill rounded-2xl"
					priority
				/>
			</div>
		</div>
	)
}
