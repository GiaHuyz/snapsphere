import AdminSidebar from '@/components/pages/admin/admin-sidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex h-screen">
			<AdminSidebar />
			<main className="flex-1 overflow-y-auto bg-secondary/10 p-8">{children}</main>
		</div>
	)
}
