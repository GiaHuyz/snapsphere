'use client'

import { createCommentAction, deleteCommentAction, getCommentsAction, IComment } from '@/actions/comment-action'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { isActionError } from '@/lib/errors'
import { useUser } from '@clerk/nextjs'
import { DropdownMenu, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { formatDistanceToNowStrict } from 'date-fns'
import { Heart, MessageSquare, MoreHorizontal, Trash } from 'lucide-react'
import NextImage from 'next/image'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import CommentInput from './comment-input'
import { PAGE_SIZE_COMMENTS } from '@/lib/constants'

export default function Comment({
	comment,
	isReply = false,
	onDelete,
	isAllowedComment
}: {
	comment: IComment
	isReply?: boolean
	onDelete: (id: string) => void
	isAllowedComment: boolean
}) {
	const [showReplyInput, setShowReplyInput] = useState(false)
	const [repliesLoaded, setRepliesLoaded] = useState(false)
	const [page, setPage] = useState(1)
	const [hasMore, setHasMore] = useState(true)
	const [replies, setReplies] = useState<IComment[]>([])
	const { user } = useUser()

	const handleReplyClick = () => {
		setShowReplyInput(!showReplyInput)
	}

	const loadReplies = async (pageToLoad: number) => {
		const newReplies = (await getCommentsAction({
			parent_id: comment._id,
			page: pageToLoad,
			pageSize: PAGE_SIZE_COMMENTS,
			pin_id: comment.pin_id
		})) as IComment[]

		if (pageToLoad === 1) {
			setReplies(newReplies)
		} else {
			setReplies([...replies, ...newReplies])
		}

		setRepliesLoaded(true)
		setPage(pageToLoad)
		setHasMore(newReplies.length === 5)
	}

	const handleAddReply = useCallback(
		async (formData: FormData) => {
			if (!user) return

			const res = await createCommentAction(formData)

			if (isActionError(res)) {
				toast.error(res.error)
			} else {
				const newReply: IComment = {
					...res,
					user: {
						username: user.username!,
						imageUrl: user.imageUrl!,
						fullName: user.fullName!
					}
				}
				setReplies((prevReplies) => [newReply, ...prevReplies])
			}
		},
		[user]
	)

    const handleDeleteReply = async (id: string) => {
        const res = await deleteCommentAction(id)

		if (isActionError(res)) {
			return toast.error(res.error)
		}

        setReplies(replies.filter((reply) => reply._id !== id))
    }

	return (
		<div className="flex flex-col gap-2">
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
						<span className="text-xs text-muted-foreground">
							{formatDistanceToNowStrict(new Date(comment.createdAt), { addSuffix: true })}
						</span>
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
						{!isReply && isAllowedComment && (
							<Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleReplyClick}>
								<MessageSquare className="h-4 w-4" />
							</Button>
						)}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon" className="h-6 w-6 ml-auto">
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								{comment.user_id === user?.id && (
									<DropdownMenuItem
										className="text-red-500 cursor-pointer"
										onClick={() => onDelete && onDelete(comment._id)}
									>
										<Trash className="mr-2 h-4 w-4" />
										Delete
									</DropdownMenuItem>
								)}
								<DropdownMenuItem className="cursor-pointer">Report</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</div>
			{/* Reply Input */}
			{showReplyInput && (
				<div className="ml-12">
					<CommentInput onAddComment={handleAddReply} parentId={comment._id} />
				</div>
			)}

			{/* Replies */}
			<div className="ml-10">
				{!repliesLoaded && comment.replyCount > 0 && (
					<Button variant="link" className="text-sm text-muted-foreground" onClick={() => loadReplies(1)}>
						View {comment.replyCount} {comment.replyCount === 1 ? 'reply' : 'replies'}
					</Button>
				)}
				{repliesLoaded &&
					replies.map((reply) => (
						<div key={reply._id} className="py-2">
							<Comment isAllowedComment={isAllowedComment} key={reply._id} comment={reply} isReply={true} onDelete={handleDeleteReply}/>
						</div>
					))}
				{repliesLoaded && hasMore && (
					<Button
						variant="link"
						className="text-sm text-muted-foreground"
						onClick={() => loadReplies(page + 1)}
					>
						Load more replies
					</Button>
				)}
			</div>
		</div>
	)
}
