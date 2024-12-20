'use client'

import { IComment } from '@/actions/comment-action'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Heart, MoreHorizontal } from 'lucide-react'
import NextImage from 'next/image'
import Link from 'next/link'

export default function Comment({ comment }: { comment: IComment }) {
	return (
		<div className="flex items-start gap-3 py-2">
			<Link href={`/user/${comment.user.username}`}>
				<Avatar className="h-8 w-8">
					<AvatarImage src={comment.user.imageUrl} alt={comment.user.username!} />
					<AvatarFallback>{comment.user.fullName?.slice(0, 2).toUpperCase()}</AvatarFallback>
				</Avatar>
			</Link>
			<div className="flex flex-col flex-1 gap-1">
				<div className="flex items-center justify-between">
					<Link href={`/user/${comment.user.username}`} className="font-medium hover:underline">
						{comment.user.fullName}
					</Link>
					{/* <span className="text-xs text-muted-foreground">
						{formatDistanceToNowStrict(new Date(comment.createdAt), { addSuffix: true })}
					</span> */}
				</div>
				<p className="text-sm">{comment.content}</p>
				{comment.image && (
					<div className="mt-2">
						<NextImage
							src={comment.image}
							alt="Comment image"
							width={150}
							height={150}
							objectFit="contain"
							className="h-auto max-h-[220px] rounded-md"
						/>
					</div>
				)}
				<div className="flex items-center gap-2 mt-2">
					<Button variant="ghost" size="icon" className="h-6 w-6">
						<Heart className="h-4 w-4" />
					</Button>
					<span className="text-xs text-muted-foreground">{comment.likes} likes</span>
					<Button variant="ghost" size="icon" className="h-6 w-6 ml-auto">
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	)
}
