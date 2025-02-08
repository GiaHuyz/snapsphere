import { getAllPinsUserAction, PinPage } from '@/actions/pin-actions'
import { PinsTable } from '@/components/pages/admin/pin-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function AdminPinsPage() {
	const pins = (await getAllPinsUserAction({})) as PinPage
	return (
		<div className="space-y-4">
			<h2 className="text-3xl font-bold tracking-tight">Pins Management</h2>
			<Card>
				<CardHeader>
					<CardTitle>Pins</CardTitle>
				</CardHeader>
				<CardContent>
					<PinsTable initialPins={pins} />
				</CardContent>
			</Card>
		</div>
	)
}
