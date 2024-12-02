'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Pencil } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'

interface BoardPreviewProps {
	id: string
	title: string
	pinCount: number
	sectionCount?: number
	timeAgo: string
	coverImages: {
		main: string
		secondary: string[]
	}
	username: string
	className?: string
}

export function BoardPreview({
	id,
	title,
	pinCount,
	sectionCount,
	timeAgo,
	coverImages,
	username,
	className
}: BoardPreviewProps) {
	const [showEdit, setShowEdit] = React.useState(false)

    const onEdit = () => {
        console.log('Edit board', id)
    }

	return (
		<div className={cn('space-y-2', className)}>
			<Link
				href={`/${username}/${title.toLowerCase()}`}
				className="group relative block overflow-hidden rounded-xl"
				onMouseEnter={() => setShowEdit(true)}
				onMouseLeave={() => setShowEdit(false)}
			>
				<div className="relative grid h-48 grid-cols-3 gap-[1.25px]">
					{/* Main Image */}
					<div className="relative col-span-2 h-full overflow-hidden">
						<Image src={coverImages.main} alt={title} fill className="object-cover" />
					</div>

					{/* Secondary Images Column */}
					<div className="relative col-span-1 grid h-full grid-rows-2 gap-[1.25px]">
						{coverImages.secondary.slice(0, 2).map((image, index) => (
							<div key={index} className="relative overflow-hidden">
								<Image
									src={image}
									alt={`${title} preview ${index + 2}`}
									fill
									className="object-cover"
								/>
							</div>
						))}
						{/* Edit Button */}
						{showEdit && onEdit && (
							<Button
								size="icon"
								variant="secondary"
								className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60"
								onClick={(e) => {
									e.preventDefault()
									onEdit()
								}}
							>
								<Pencil className="h-4 w-4" />
							</Button>
						)}
					</div>
				</div>
			</Link>

			{/* Board Info */}
			<div className="space-y-0.5">
				<h3 className="text-base font-medium">{title}</h3>
				<p className="text-sm text-muted-foreground">
					{pinCount} Pins
					{sectionCount && sectionCount > 0 && ` · ${sectionCount} section`}
					{timeAgo && ` · ${timeAgo}`}
				</p>
			</div>
		</div>
	)
}
