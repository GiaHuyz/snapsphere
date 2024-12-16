'use client'

import MansoryLayout from '@/components/mansory-layout'
import Pin from '@/components/pin'
import { usePinStore } from '@/provider/pin-provider'

export default function PinList() {
	const { pins } = usePinStore()

	return (
		<MansoryLayout className="xl:columns-6">
			{pins.map((pin) => (
				<Pin key={pin._id} pin={pin} />
			))}
		</MansoryLayout>
	)
}
