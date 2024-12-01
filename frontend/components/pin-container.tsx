'use client'

import Image from 'next/image'

import { MansoryLayout } from '@/components/mansory-layout'

interface PinContainerProps {
	images: {
		id: string
		src: string
		alt: string
		width: number
		height: number
	}[]
	className?: string
}

export function PinContainer({ images }: PinContainerProps) {
	return (
		<MansoryLayout>
			{images.map((image) => (
				<div key={image.id} className="mb-4 rounded-2xl overflow-hidden">
					<Image
						src={image.src}
						alt={image.alt}
						width={image.width}
						height={image.height}
						className="w-full object-contain"
					/>
				</div>
			))}
		</MansoryLayout>
	)
}
