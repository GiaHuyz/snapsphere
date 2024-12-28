import { PinsTable } from '@/components/admin/pin-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminPinsPage() {
	return (
		<div className="space-y-4">
			<h2 className="text-3xl font-bold tracking-tight">Pins Management</h2>
			<Card>
				<CardHeader>
					<CardTitle>Pins</CardTitle>
				</CardHeader>
				<CardContent>
					<PinsTable />
				</CardContent>
			</Card>
		</div>
	)
}
