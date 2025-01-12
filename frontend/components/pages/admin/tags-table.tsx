'use client'

import { Tag, TagPage, createTagAction, deleteTagAction, getTagsAction } from '@/actions/tag-actions'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Pagination } from '@/components/ui/pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PAGE_SIZE_TAGS } from '@/lib/constants'
import { isActionError } from '@/lib/errors'
import { formatTime } from '@/lib/format-time'
import { Plus, Trash } from 'lucide-react'
import { useDeferredValue, useEffect, useState } from 'react'
import { toast } from 'sonner'

export function TagsTable({ initialData }: { initialData: TagPage }) {
	const [tags, setTags] = useState<Tag[]>(initialData.tags)
	const [searchQuery, setSearchQuery] = useState('')
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
	const [newTagName, setNewTagName] = useState('')
	const [currentPage, setCurrentPage] = useState(1)
	const [totalPages, setTotalPages] = useState(initialData.totalPages)
	const deferredSearchQuery = useDeferredValue(searchQuery)

	const handleAddTag = async () => {
		if (!newTagName.trim()) return

		const newTag = await createTagAction(newTagName)

		if (isActionError(newTag)) {
			toast.error(newTag.error)
			return
		}

		setTags([newTag, ...tags])
		setNewTagName('')
		setIsAddDialogOpen(false)
		toast.success('Tag added successfully')
	}

	const handleDeleteTag = async (tagId: string) => {
		const deletedTag = await deleteTagAction(tagId)

		if (isActionError(deletedTag)) {
			toast.error(deletedTag.error)
			return
		}

		setTags(tags.filter((tag) => tag._id !== tagId))
		toast.success('Tag deleted successfully')
	}

	const fetchTags = async (page: number, pageSize: number, name?: string) => {
		const res = await getTagsAction({ page, pageSize, name })
		if (isActionError(res)) {
			toast.error(res.error)
			return
		}
		setTags(res.tags)
		setCurrentPage(page)
		setTotalPages(res.totalPages)
	}

	useEffect(() => {
		if (deferredSearchQuery) {
			fetchTags(1, PAGE_SIZE_TAGS, deferredSearchQuery)
		} else {
			fetchTags(1, PAGE_SIZE_TAGS)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [deferredSearchQuery])

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<Input
					type="text"
					placeholder="Search tags..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="max-w-sm"
				/>
				<Button onClick={() => setIsAddDialogOpen(true)}>
					<Plus className="mr-2 h-4 w-4" /> Add Tag
				</Button>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Created At</TableHead>
							<TableHead className="text-center">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{tags.map((tag) => (
							<TableRow key={tag._id}>
								<TableCell>{tag.name}</TableCell>
								<TableCell>{formatTime(tag.createdAt)}</TableCell>
								<TableCell className="text-center">
									<Button
										variant="outline"
										size="icon"
										className="bg-red-500"
										onClick={() => handleDeleteTag(tag._id)}
									>
										<Trash className="h-4 w-4" />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={(page) => fetchTags(page, PAGE_SIZE_TAGS, deferredSearchQuery)}
			/>

			<Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add New Tag</DialogTitle>
					</DialogHeader>
					<div className="flex flex-col gap-2">
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							value={newTagName}
							onChange={(e) => setNewTagName(e.target.value)}
							onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
						/>
					</div>
					<DialogFooter>
						<Button type="submit" onClick={handleAddTag}>
							Add Tag
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}
