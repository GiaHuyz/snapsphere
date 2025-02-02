import { getAllPinsUserAction } from '@/actions/pin-actions'
import PinList from '@/components/pin/pin-list'
import { Button } from '@/components/ui/button'
import { isActionError } from '@/lib/errors'
import Image from 'next/image'
import Link from 'next/link'

export default async function IdeasPage() {
	const pins = await getAllPinsUserAction({})

	if (isActionError(pins)) {
		return (
			<div className="flex items-center justify-center mt-8">
				<h1 className="text-2xl font-semibold">Something went wrong</h1>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-background">
			<main className="container py-6 mx-auto max-w-6xl">
				<section className="space-y-6">
					<h2 className="text-2xl font-semibold tracking-tight">What&apos;s new on Snapsphere</h2>
					<PinList pageName="Ideas" initialPins={pins.data} />
				</section>
			</main>
		</div>
	)
}
