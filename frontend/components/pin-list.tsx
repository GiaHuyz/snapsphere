'use client'

import { Board } from '@/actions/board-actions'
import { getAllPinsUserAction, getPinsByBoardIdAction, Pin as PinType } from '@/actions/pin-actions'
import MansoryLayout from '@/components/mansory-layout'
import Pin from '@/components/pin'
import { useMounted } from '@/hooks/use-mouted'
import { usePinStore } from '@/hooks/use-pin-store'
import { PAGE_SIZE_PINS } from '@/lib/constants'
import { isActionError } from '@/lib/errors'
import { useUser } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'

interface PinListProps {
	initialPins: PinType[]
	boardsDropdown: Board[]
	boardId?: string
	pageName?: 'BoardDetail' | 'User' | 'Home'
}

export default function PinList({ initialPins, boardsDropdown, boardId, pageName }: PinListProps) {
	const { pins, setPins } = usePinStore()
	const [hasMore, setHasMore] = useState(true)
	const [page, setPage] = useState(2)
	const [scrollTrigger, isInView] = useInView()
	const isMouted = useMounted()
	const { user } = useUser()

	const loadMorePins = async () => {
		if (hasMore) {
			let res
			if (pageName === 'BoardDetail') {
				res = await getPinsByBoardIdAction({ board_id: boardId!, page: page, pageSize: PAGE_SIZE_PINS })
			} else if (pageName === 'User') {
				res = await getAllPinsUserAction({ user_id: user?.id, page: page, pageSize: PAGE_SIZE_PINS })
			} else if (pageName === 'Home') {
				res = await getAllPinsUserAction({ page: page, pageSize: PAGE_SIZE_PINS })
			}
			if (!isActionError(res)) {
				setPins([...pins, ...(res as PinType[])])
				setPage((prevPage) => prevPage + 1)
				if ((res as PinType[]).length < PAGE_SIZE_PINS) {
					setHasMore(false)
				}
			}
		}
	}

	useEffect(() => {
		setPins(initialPins)
	}, [initialPins, setPins])

	useEffect(() => {
		if (isInView && hasMore) {
			loadMorePins()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isInView, hasMore])

	return (
		<>
			<MansoryLayout className="xl:columns-6">
				{(isMouted ? pins : initialPins).map((pin) => (
					<Pin key={pin._id} pin={pin} boardsDropdown={boardsDropdown} />
				))}
			</MansoryLayout>
			<div className="flex justify-center mt-5">
				{hasMore && (
					<div ref={scrollTrigger}>
						<Loader2 className="h-8 w-8 animate-spin" />
					</div>
				)}
			</div>
		</>
	)
}
