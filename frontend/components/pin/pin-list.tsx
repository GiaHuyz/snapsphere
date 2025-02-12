'use client'

import { getAllPinsUserAction, getPinsByBoardIdAction, getSimilarPinsAction, Pin as PinType } from '@/actions/pin-actions'
import MansoryLayout from '@/components/mansory-layout'
import Pin from '@/components/pin/pin'
import { useMounted } from '@/hooks/use-mouted'
import { PAGE_SIZE_PINS } from '@/lib/constants'
import { isActionError } from '@/lib/errors'
import { usePinStore } from '@/stores/use-pin-store'
import { useUser } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'

interface PinListProps {
	initialPins: PinType[]
	boardId?: string
	pageName?: 'BoardDetail' | 'User' | 'Home' | 'Search' | 'Ideas' | 'Similar'
	search?: string
	pinId?: string
}

export default function PinList({ initialPins, boardId, pageName, search, pinId }: PinListProps) {
	const { pins, setPins } = usePinStore()
	const [hasMore, setHasMore] = useState(true)
	const [page, setPage] = useState(2)
	const [scrollTrigger, isInView] = useInView()
	const isMouted = useMounted()
	const { user } = useUser()

	const loadMorePins = async () => {
		if (hasMore) {
			if (pageName === 'BoardDetail') {
				const res = await getPinsByBoardIdAction({ board_id: boardId!, page: page, pageSize: PAGE_SIZE_PINS })
				if (!isActionError(res)) {
					setPins([...pins, ...res])
					setPage((prevPage) => prevPage + 1)
					if (res.length < PAGE_SIZE_PINS) {
						setHasMore(false)
					}
				}
			} else if (pageName === 'User') {
				const res = await getAllPinsUserAction({ user_id: user?.id, page: page, pageSize: PAGE_SIZE_PINS })
				if (!isActionError(res)) {
					setPins([...pins, ...res.data])
					setPage((prevPage) => prevPage + 1)
					if (res.data.length < PAGE_SIZE_PINS) {
						setHasMore(false)
					}
				}
			} else if (pageName === 'Home' || pageName === 'Ideas') {
				const res = await getAllPinsUserAction({ page: page, pageSize: PAGE_SIZE_PINS })
				if (!isActionError(res)) {
					setPins([...pins, ...res.data])
					setPage((prevPage) => prevPage + 1)
					if (res.data.length < PAGE_SIZE_PINS) {
						setHasMore(false)
					}
				}
			} else if (pageName === 'Search') {
				const res = await getAllPinsUserAction({ search: search, page: page, pageSize: PAGE_SIZE_PINS })
				if (!isActionError(res)) {
					setPins([...pins, ...res.data])
					setPage((prevPage) => prevPage + 1)
					if (res.data.length < PAGE_SIZE_PINS) {
						setHasMore(false)
					}
				}
			} else if (pageName === 'Similar') {
				const res = await getSimilarPinsAction({ 
					pinId: pinId!, 
					page, 
					pageSize: PAGE_SIZE_PINS 
				})
				if (!isActionError(res)) {
					setPins([...pins, ...res])
					setPage((prevPage) => prevPage + 1)
					if (res.length < PAGE_SIZE_PINS) {
						setHasMore(false)
					}
				}
			}
		}
	}

	useEffect(() => {
		setPins(initialPins)
		setPage(2)
		setHasMore(true)
	}, [initialPins, search])

	useEffect(() => {
		if (isInView && hasMore) {
			loadMorePins()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isInView, hasMore])

	return (
		<>
			<MansoryLayout className={pageName === 'Ideas' ? 'xl:columns-4' : 'xl:columns-6'}>
				{(isMouted ? pins : initialPins).map((pin) => (
					<Pin key={pin._id} pin={pin} />
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
