import { Board } from '@/actions/board-actions'
import { Pin as PinType } from '@/actions/pin-actions'
import MansoryLayout from '@/components/mansory-layout'
import Pin from '@/components/pin'

export default function PinList({ pins, boardsDropdown }: { pins: PinType[]; boardsDropdown: Board[] }) {
	return (
		<MansoryLayout className="xl:columns-6">
			{pins.map((pin) => (
				<Pin key={pin._id} pin={pin} boardsDropdown={boardsDropdown} />
			))}
		</MansoryLayout>
	)
}
