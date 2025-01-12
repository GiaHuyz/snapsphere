import { getTagsAction, TagPage } from '@/actions/tag-actions'
import { TagsTable } from '@/components/pages/admin/tags-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function AdminTagsPage() {
	const initialData = await getTagsAction({}) as TagPage

	return (
		<div className="space-y-4">
			<h2 className="text-3xl font-bold tracking-tight">Tags Management</h2>
			<Card>
				<CardHeader>
					<CardTitle>Tags</CardTitle>
				</CardHeader>
				<CardContent>
					<TagsTable initialData={initialData} />
				</CardContent>
			</Card>
		</div>
	)
}
