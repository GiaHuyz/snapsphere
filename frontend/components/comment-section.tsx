'use client'

import { createCommentAction, deleteCommentAction, getCommentsAction, IComment } from '@/actions/comment-action'
import Comment from '@/components/comment'
import CommentInput from '@/components/comment-input'
import { PAGE_SIZE_COMMENTS } from '@/lib/constants'
import { isActionError } from '@/lib/errors'
import { useUser } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { toast } from 'sonner'

export function CommentSection({
	initialComments,
	isAllowedComment
}: {
	initialComments: IComment[]
	isAllowedComment: boolean
}) {
	const [comments, setComments] = useState<IComment[]>(initialComments)
	const [page, setPage] = useState(2)
	const pinId = usePathname().split('/').pop()
	const [hasMore, setHasMore] = useState(true)
	const [scrollTrigger, isInView] = useInView()
	const { user } = useUser()

	const loadMoreComments = async () => {
		if (hasMore) {
			const res = (await getCommentsAction({ pin_id: pinId!, page: page, pageSize: PAGE_SIZE_COMMENTS }))
            if(!isActionError(res)) {
                setComments((prevComments) => [...prevComments, ...res])
                setPage((prevPage) => prevPage + 1)
                if(res.length < PAGE_SIZE_COMMENTS) {
                    setHasMore(false)
                }
            }
		}
	}

	useEffect(() => {
		if (isInView && hasMore) {
			loadMoreComments()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isInView, hasMore])

	const handleAddComment = useCallback(
		async (formData: FormData) => {
			if (!user) return
			const res = await createCommentAction(formData)

			if (isActionError(res)) {
				toast.error(res.error)
			} else {
				const newComment = {
					...res,
					user: {
						username: user.username!,
						imageUrl: user.imageUrl!,
						fullName: user.fullName!
					}
				}
				setComments((prevComments) => [newComment, ...prevComments])
			}
		},
		[user]
	)

	const handleDelete = async (id: string) => {
		const res = await deleteCommentAction(id)

		if (isActionError(res)) {
			return toast.error(res.error)
		}

		setComments(comments.filter((comment) => comment._id !== id))
	}

	return (
		<div className="space-y-4">
			<div className="space-y-2 max-h-[335px] overflow-y-auto">
				{comments.map((comment) => (
					<Comment key={comment._id} comment={comment} onDelete={handleDelete} isAllowedComment={isAllowedComment} />
				))}
				<div className="flex justify-center">
					{hasMore && (
						<div ref={scrollTrigger}>
							<Loader2 className="h-4 w-4 animate-spin" />
						</div>
					)}
				</div>
			</div>
			{isAllowedComment ? (
				<CommentInput onAddComment={handleAddComment} />
			) : (
				<div>
					<p className="text-xl text-muted-foreground text-center">This pin is not allowed to comment</p>
				</div>
			)}
		</div>
	)
}
