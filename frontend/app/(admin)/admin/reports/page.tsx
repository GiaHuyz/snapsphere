import { ReportsTable } from '@/components/admin/report-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminReportsPage() {
	return (
		<div className="space-y-4">
			<h2 className="text-3xl font-bold tracking-tight">Reports Management</h2>
			<Card>
				<CardHeader>
					<CardTitle>Reports</CardTitle>
				</CardHeader>
				<CardContent>
					<ReportsTable />
				</CardContent>
			</Card>
		</div>
	)
}
