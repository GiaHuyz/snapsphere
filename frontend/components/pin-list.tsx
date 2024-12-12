import { Pin as PinType } from '@/actions/pin-actions'
import MansoryLayout from '@/components/mansory-layout'
import Pin from '@/components/pin'

export default function PinList({ pins }: { pins: PinType[] }) {
	return (
		<MansoryLayout className="xl:columns-6">
			{pins.map((pin) => (
				<Pin key={pin._id} pin={pin} />
			))}
		</MansoryLayout>
	)
}
