import { getRecommendedPinsAction } from '@/actions/pin-actions'
import PinList from '@/components/pin/pin-list'
import { isActionError } from '@/lib/errors'

export default async function HomePage() {
	const pins = await getRecommendedPinsAction({})

	if (isActionError(pins)) {
		return (
			<div className="flex items-center justify-center mt-8">
				<h1 className="text-2xl font-semibold">Something went wrong</h1>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-background">
			<div className="py-6">
				<PinList pageName="Home" initialPins={pins.data} />
			</div>
		</div>
	)
}
