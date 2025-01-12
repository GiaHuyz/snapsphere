import { getAllPinsUserAction } from '@/actions/pin-actions'
import PinList from '@/components/pin/pin-list'
import { isActionError } from '@/lib/errors'
import { redirect } from 'next/navigation'

export default async function HomePage({ searchParams }: { searchParams: Promise<{ q: string }> }) {

    const params = await searchParams

    if(!params.q) {
        redirect('/')
    }

	const pins = await getAllPinsUserAction({ search: params.q })

	if (isActionError(pins)) {
		return (
			<div>
				<h1>Something went wrong</h1>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-background">
			<div className="py-6">
				<PinList pageName="Search" initialPins={pins.data} search={params.q} />
			</div>
		</div>
	)
}
