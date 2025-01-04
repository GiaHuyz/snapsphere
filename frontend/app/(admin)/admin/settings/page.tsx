import { ProfileForm } from '@/components/pages/profile/profile-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import getCurrentUser from '@/lib/get-current-user'

export default async function AdminSettingsPage() {
	const user = await getCurrentUser()
	return (
		<div className="space-y-4">
			<h2 className="text-3xl font-bold tracking-tight">Admin Settings</h2>
			<Card>
				<CardHeader>
					<CardTitle>Settings</CardTitle>
				</CardHeader>
				<CardContent>
					<ProfileForm initUser={JSON.parse(JSON.stringify(user))} />
				</CardContent>
			</Card>
		</div>
	)
}
