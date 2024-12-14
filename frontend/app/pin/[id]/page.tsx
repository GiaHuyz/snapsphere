'use client'

import { CommentInput } from '@/components/comment-input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Expand, Heart, MoreHorizontal, Share2, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

interface FullScreenViewProps {
	imageUrl: string
	onClose: () => void
}

const FullScreenView: React.FC<FullScreenViewProps> = ({ imageUrl, onClose }) => {
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
			<div className="relative max-h-[90vh] max-w-[90vw] my-8 mx-auto" onClick={(e) => e.stopPropagation()}>
				<Image
					src={imageUrl}
					alt="Expanded view"
					width={1200}
					height={800}
					className="max-h-[90vh] max-w-[90vw] w-auto object-contain rounded-2xl"
					priority
				/>
			</div>
		</div>
	)
}

export default function PinDetails() {
	const [isFullScreen, setIsFullScreen] = useState(false)

	const imageUrl =
		'https://plus.unsplash.com/premium_photo-1731624534286-adf5e9c78159?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

	return (
		<div className="min-h-screen">
			<div className="flex items-center justify-center py-8">
				<div className="grid w-full max-w-5xl grid-cols-1 gap-4 rounded-2xl bg-white p-4 shadow-2xl lg:grid-cols-[500px,1fr]">
					{/* Left: Image Section */}
					<div className="relative">
						<div className="relative w-full overflow-hidden rounded-lg">
							<Image
								src={imageUrl}
								alt="Detailed landscape artwork"
								width={500}
								height={500}
								className="h-auto w-full max-h-[685px] object-cover"
								priority
							/>
							<Button
								size="icon"
								variant="secondary"
								className="absolute bottom-4 right-4 rounded-full bg-white/90 backdrop-blur-sm"
								onClick={() => setIsFullScreen(true)}
							>
								<Expand className="h-5 w-5" />
							</Button>
						</div>
					</div>

					{/* Right: Info Section */}
					<div className="flex flex-col">
						{/* Top Actions */}
						<div className="flex items-center justify-between pb-4">
							<div className="flex items-center gap-2">
								<div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-2">
									<Heart className="h-5 w-5" />
									<span className="text-sm font-medium">30</span>
								</div>
								<Button size="icon" variant="secondary" className="rounded-full">
									<Share2 className="h-5 w-5" />
								</Button>
								<Button size="icon" variant="secondary" className="rounded-full">
									<MoreHorizontal className="h-5 w-5" />
								</Button>
							</div>
							<div className="flex items-center gap-2">
								<Button variant="secondary" className="rounded-full">
									wuxia
								</Button>
								<Button variant="default" className="rounded-full">
									Save
								</Button>
							</div>
						</div>

						{/* User Info */}
						<div className="flex items-center justify-between py-4">
							<Link href={`/giahuy957z`}>
								<div className="flex items-center gap-2">
									<Avatar>
										<AvatarImage src="/placeholder.svg?height=40&width=40" alt="Mùa Hoa" />
										<AvatarFallback>MH</AvatarFallback>
									</Avatar>
									<div>
										<h2 className="font-medium">Mùa Hoa</h2>
										<p className="text-sm text-muted-foreground">1k followers</p>
									</div>
								</div>
							</Link>
							<Button variant="outline" className="rounded-full">
								Follow
							</Button>
						</div>

						{/* Comments Section */}
						<div className="flex-1 overflow-y-auto">
							<h3 className="font-medium">No comments yet</h3>
							<p className="text-sm text-muted-foreground">
								No comments yet! Add one to start the conversation.
							</p>
						</div>

						{/* Comment Input */}
						<div className="pt-4">
							<CommentInput />
						</div>
					</div>
				</div>
			</div>
			{isFullScreen && <FullScreenView imageUrl={imageUrl} onClose={() => setIsFullScreen(false)} />}
		</div>
	)
}
