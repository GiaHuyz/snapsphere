'use client'

import { Button } from '@/components/ui/button'
import { useEditBoardModal } from '@/hooks/use-edit-board-modal'
import { formatTime } from '@/lib/format-time'
import { useUser } from '@clerk/nextjs'
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
	coverImages: {
		_id: string
		url: string
	}[]
	username: string
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
	username
}: BoardPreviewProps) {
	const { onOpen: onOpenEdit } = useEditBoardModal()
	const { user } = useUser()

	return (
		<div className="space-y-2">
			<Link
				href={`${username}/${title.toLowerCase()}`}
				className="group relative block overflow-hidden rounded-xl"
			>
				<div className="group relative grid h-40 grid-cols-3 gap-[1.25px]">
					{/* Main Image */}
					<div className="relative col-span-2 overflow-hidden bg-slate-300">
						{coverImages[0] && (
							<Image src={coverImages[0].url || ''} alt={title} fill className="object-fill" />
						)}
					</div>

					{/* Secondary Images Column */}
					<div className="relative col-span-1 grid h-full grid-rows-2 gap-[1.25px]">
						{Array.from({ length: 2 }, (_, index) =>
							coverImages[index + 1] ? (
								<div key={index} className="relative overflow-hidden">
									<Image
										src={coverImages[index + 1].url}
										alt={`${title} preview ${index + 2}`}
										fill
										className="object-fill"
									/>
								</div>
							) : (
								<div key={index} className="relative overflow-hidden bg-slate-300"></div>
							)
						)}
					</div>

					{user?.username === username && (
						<Button
							size="icon"
							variant="secondary"
							className="opacity-0 absolute bottom-2 right-2 h-8 w-8 rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 group-hover:opacity-100"
							onClick={(e) => {
								e.preventDefault()
								onOpenEdit(_id, {
									title,
									description,
									coverImage: coverImages[0]?.url,
									secret
								})
							}}
						>
							<Pencil className="h-4 w-4" />
						</Button>
					)}
				</div>
			</Link>

			{/* Board Info */}
			<div className="space-y-0.5">
				<h3 className="text-lg font-bold">{title}</h3>
				<p className="text-xs text-muted-foreground">
					{pinCount} Pins
					{sectionCount && sectionCount > 0 && ` · ${sectionCount} section`}
					{` · ${formatTime(createdAt)}`}
				</p>
			</div>
		</div>
	)
}
