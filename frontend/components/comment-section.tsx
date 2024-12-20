'use client'

import { getCommentsAction, IComment } from '@/actions/comment-action'
import { getUserAction } from '@/actions/user-action'
import Comment from '@/components/comment'
import CommentInput from '@/components/comment-input'
import { Loader2 } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'

const PAGE_SIZE = 5

export function CommentSection({ initialComments }: { initialComments: IComment[] }) {
	const [comments, setComments] = useState<IComment[]>(initialComments)
	const [page, setPage] = useState(2)
	const pinId = usePathname().split('/').pop()
	const [hasMore, setHasMore] = useState(true)
	const [scrollTrigger, isInView] = useInView()

	const loadMoreComments = async () => {
		if (hasMore) {
			const res = (await getCommentsAction({ pin_id: pinId!, page: page, pageSize: PAGE_SIZE })) as IComment[]
			if (res.length === 0) {
				setHasMore(false)
			}
			for (let i = 0; i < res.length; i++) {
				const user = JSON.parse(await getUserAction(res[i].user_id))
				res[i].user = {
					username: user.username!,
					fullName: user.fullName!,
					imageUrl: user.imageUrl
				}
			}
			setComments((prevComments) => [...prevComments, ...res])
			setPage((prevPage) => prevPage + 1)
		}
	}

	useEffect(() => {
		if (isInView && hasMore) {
			loadMoreComments()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isInView, hasMore])

	return (
		<div className="space-y-4">
			<div className="space-y-2 h-[410px] overflow-y-auto">
				{comments.map((comment) => (
					<Comment key={comment._id} comment={comment} />
				))}
				<div className="flex justify-center">
					{hasMore && (
						<div ref={scrollTrigger}>
							<Loader2 className='h-4 w-4 animate-spin'/>
						</div>
					)}
				</div>
			</div>
			<CommentInput setComments={setComments} />
		</div>
	)
}
