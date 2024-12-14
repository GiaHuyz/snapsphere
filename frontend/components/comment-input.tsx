'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useUploadImageModal } from '@/hooks/use-upload-image-modal'
import type { EmojiClickData } from 'emoji-picker-react'
import { ImageUp, Smile, X } from 'lucide-react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false })

export function CommentInput() {
	const [comment, setComment] = useState('')
	const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const { upLoadImage, setUploadImage, onOpen } = useUploadImageModal()
	const emojiPickerRef = useRef<HTMLDivElement>(null)
	const emojiButtonRef = useRef<HTMLButtonElement>(null)

	const handleEmojiClick = (emojiData: EmojiClickData) => {
        setShowEmojiPicker(false)
		setComment((prevComment) => prevComment + emojiData.emoji)
	}

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				emojiPickerRef.current &&
				!emojiPickerRef.current.contains(event.target as Node) &&
				!emojiButtonRef.current?.contains(event.target as Node)
			) {
				setShowEmojiPicker(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	return (
		<div className="flex flex-col rounded-2xl border bg-background px-3 py-1 ring-offset-background">
			{upLoadImage && (
				<div
					className={`relative my-2`}
					style={{
						width: upLoadImage.width,
						height: upLoadImage.height
					}}
				>
					<Image
						src={upLoadImage.url}
						alt="Comment attachment"
						fill
						className="h-full w-full object-cover rounded-lg"
					/>
					<Button
						size="icon"
						variant="secondary"
						className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60"
						onClick={() => setUploadImage(null)}
					>
						<X className="h-3 w-3" />
					</Button>
				</div>
			)}
			<div className="flex items-center">
				<Input
					type="text"
					placeholder="Add a comment"
					value={comment}
					onChange={(e) => setComment(e.target.value)}
					className="flex-1 border-0 shadow-none bg-transparent p-0 text-sm ring-0 focus-visible:outline-none focus-visible:ring-0 placeholder:text-muted-foreground"
				/>
				<div className="flex items-center gap-1">
					<div className="relative">
						<Button
							size="icon"
							variant="ghost"
							className="h-8 w-8"
							onClick={() => setShowEmojiPicker(!showEmojiPicker)}
							ref={emojiButtonRef}
						>
							<Smile className="h-4 w-4" />
						</Button>
						{showEmojiPicker && (
							<div className="absolute bottom-full right-0 mb-2" ref={emojiPickerRef}>
								<EmojiPicker lazyLoadEmojis onEmojiClick={handleEmojiClick} />
							</div>
						)}
					</div>
					<Button size="icon" variant="ghost" className="h-8 w-8" onClick={onOpen}>
						<ImageUp className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	)
}
