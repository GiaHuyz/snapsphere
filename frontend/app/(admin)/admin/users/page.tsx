import { getUsers } from '@/actions/admin-actions'
import { UsersTable } from '@/components/admin/user-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function AdminUsersPage() {
	const initialData = await getUsers()

	return (
		<div className="space-y-4">
			<h2 className="text-3xl font-bold tracking-tight">Users Management</h2>
			<Card>
				<CardHeader>
					<CardTitle>Users</CardTitle>
				</CardHeader>
				<CardContent>
					<UsersTable initialData={initialData} />
				</CardContent>
			</Card>
		</div>
	)
}

