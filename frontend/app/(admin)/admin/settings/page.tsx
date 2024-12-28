import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminSettingsPage() {
	return (
		<div className="space-y-4">
			<h2 className="text-3xl font-bold tracking-tight">Admin Settings</h2>
			<Card>
				<CardHeader>
					<CardTitle>Settings</CardTitle>
				</CardHeader>
				<CardContent>
					<p>Admin settings content goes here.</p>
				</CardContent>
			</Card>
		</div>
	)
}

