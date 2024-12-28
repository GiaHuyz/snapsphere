'use client'

import { Board } from '@/actions/board-actions'
import { getAllPinsUserAction, Pin as PinType } from '@/actions/pin-actions'
import MansoryLayout from '@/components/mansory-layout'
import Pin from '@/components/pin'
import { useMounted } from '@/hooks/use-mouted'
import { usePinStore } from '@/hooks/use-pin-store'
import { PAGE_SIZE_PINS } from '@/lib/constants'
import { isActionError } from '@/lib/errors'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'

export default function PinList({ initialPins, boardsDropdown }: { initialPins: PinType[]; boardsDropdown: Board[] }) {
	const { pins, setPins } = usePinStore()
	const [hasMore, setHasMore] = useState(true)
	const [page, setPage] = useState(2)
	const [scrollTrigger, isInView] = useInView()
    const isMouted = useMounted()

	const loadMorePins = async () => {
		if (hasMore) {
			const res = (await getAllPinsUserAction({ page: page, pageSize: PAGE_SIZE_PINS })) 
            if(!isActionError(res)) {
                setPins([...pins, ...res])
                setPage((prevPage) => prevPage + 1)
                if(res.length < PAGE_SIZE_PINS) {
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
