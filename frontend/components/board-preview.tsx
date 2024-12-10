'use client'

import { Board } from '@/actions/board-actions'
import { Button } from '@/components/ui/button'
import { useEditBoardModal } from '@/hooks/use-edit-board-modal'
import { formatTime } from '@/lib/format-time'
import { Pencil } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface BoardPreviewProps {
	_id: string
	title: string
    description: string
	secret: boolean
	pinCount: number
	sectionCount?: number
	createdAt: string
	coverImages: string[]
	username: string
    setBoards: (boards: Board[]) => void
}

export default function BoardPreview({
	_id,
	title,
    description,
	secret,
	pinCount = 0,
	sectionCount,
	createdAt,
	coverImages,
	username,
    setBoards
}: BoardPreviewProps) {
	const { onOpen: onOpenEdit } = useEditBoardModal()

	return (
		<div className='space-y-2'>
			<Link
				href={`/${username}/${title.toLowerCase()}`}
				className="group relative block overflow-hidden rounded-xl"
			>
				<div className="group relative grid h-48 grid-cols-3 gap-[1.25px]">
					{/* Main Image */}
					<div className="relative col-span-2 h-full overflow-hidden bg-slate-300">
						{coverImages[0] && <Image src={coverImages[0]} alt={title} fill className="object-cover" />}
					</div>

					{/* Secondary Images Column */}
					<div className="relative col-span-1 grid h-full grid-rows-2 gap-[1.25px]">
						{coverImages.slice(1).length === 0 && (
							<>
								<div className="relative overflow-hidden bg-slate-300"></div>
								<div className="relative overflow-hidden bg-slate-300"></div>
							</>
						)}
						{coverImages.slice(1).map((image, index) => (
							<div key={index} className="relative overflow-hidden">
								<Image
									src={image}
									alt={`${title} preview ${index + 2}`}
									fill
									className="object-cover"
								/>
							</div>
						))}
					</div>

					<Button
						size="icon"
						variant="secondary"
						className="opacity-0 absolute bottom-2 right-2 h-8 w-8 rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 group-hover:opacity-100"
						onClick={(e) => {
							e.preventDefault()
							onOpenEdit(_id, {
                                title,
                                description,
                                coverImage: coverImages[0],
                                secret 
                            }, setBoards)
						}}
					>
						<Pencil className="h-4 w-4" />
					</Button>
				</div>
			</Link>

			{/* Board Info */}
			<div className="space-y-0.5">
				<h3 className="text-base font-medium">{title}</h3>
				<p className="text-sm text-muted-foreground">
					{pinCount} Pins
					{sectionCount && sectionCount > 0 && ` · ${sectionCount} section`}
					{` · ${formatTime(createdAt)}`}
				</p>
			</div>
		</div>
	)
}
