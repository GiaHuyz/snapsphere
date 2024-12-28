import AdminSidebar from '@/components/admin/admin-sidebar'
import { isAdmin } from '@/lib/check-admin'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
	if (!(await isAdmin())) {
		redirect('/')
	}

	return (
		<div className="flex h-screen">
			<AdminSidebar />
			<main className="flex-1 overflow-y-auto bg-secondary/10 p-8">{children}</main>
		</div>
	)
}
