'use client'

import { Pin as PinType } from '@/actions/pin-actions'
import MansoryLayout from '@/components/mansory-layout'
import Pin from '@/components/pin'
import { useEditPinModal } from '@/hooks/use-edit-pin-modal'
import { useEffect, useState } from 'react'

export default function PinList({ initPins }: { initPins: PinType[] }) {
    const [pins, setPins] = useState<PinType[]>(initPins)
    const { setMutatePinsFn } = useEditPinModal()

    useEffect(() => {
        setPins(initPins)
        setMutatePinsFn(setPins)
    }, [initPins, setMutatePinsFn])

	return (
		<MansoryLayout className="xl:columns-6">
			{pins.map((pin) => (
				<Pin key={pin._id} pin={pin} />
			))}
		</MansoryLayout>
	)
}
