import { Overview } from '@/components/pages/admin/overview'
import { RecentPins } from '@/components/pages/admin/recent-pins'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminOverviewPage() {
	return (
		<div className="space-y-4">
			<h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Users</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">2,350</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Pins</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">12,234</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Active Reports</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">23</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">New Users (24h)</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">+124</div>
					</CardContent>
				</Card>
			</div>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
				<Card className="col-span-4">
					<CardHeader>
						<CardTitle>Overview</CardTitle>
					</CardHeader>
					<CardContent className="pl-2">
						<Overview />
					</CardContent>
				</Card>
				<Card className="col-span-3">
					<CardHeader>
						<CardTitle>Recent Pins</CardTitle>
					</CardHeader>
					<CardContent>
						<RecentPins />
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
