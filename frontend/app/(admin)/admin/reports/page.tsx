import { getReportsAction, ReportPage } from '@/actions/report-actions'
import { ReportsTable } from '@/components/pages/admin/report-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function AdminReportsPage() {
	const initialData = await getReportsAction({})

	return (
		<div className="space-y-4">
			<h2 className="text-3xl font-bold tracking-tight">Reports Management</h2>
			<Card>
				<CardHeader>
					<CardTitle>Reports</CardTitle>
				</CardHeader>
				<CardContent>
					<ReportsTable initialData={initialData as ReportPage} />
				</CardContent>
			</Card>
		</div>
	)
}
