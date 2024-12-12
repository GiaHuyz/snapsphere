'use client'

import { deleteBoardAction, editBoardAction } from '@/actions/board-actions'
import { LoaderButton } from '@/components/loading-button'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { useEditBoardModal } from '@/hooks/use-edit-board-modal'
import { isActionError } from '@/lib/errors'
import { useBoardDropdownStore } from '@/provider/board-provider'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

export const editBoardSchema = z.object({
	title: z.string().min(1, 'Board name is required').max(50, 'Board name must be 50 characters or less'),
	description: z.string().max(160, 'Description must be 160 characters or less').optional(),
	secret: z.boolean()
})

export type EditBoardData = z.infer<typeof editBoardSchema>

export function EditBoardModal() {
	const { isOpen, onClose, boardId, boardData, mutateBoardsFn } = useEditBoardModal()
	const [isLoading, setIsLoading] = useState(false)
	const [showDeleteAlert, setShowDeleteAlert] = useState(false)
	const { boardsDropdown, setBoardsDropdown } = useBoardDropdownStore()

	const form = useForm<EditBoardData>({
		resolver: zodResolver(editBoardSchema),
		defaultValues: {
			title: boardData?.title || '',
			secret: boardData?.secret,
			description: boardData?.description || ''
		}
	})

	// Reset form when modal opens with new data
	useEffect(() => {
		if (boardData) {
			form.reset({
				title: boardData.title,
				secret: boardData.secret,
				description: boardData.description
			})
		}
	}, [boardData, form])

	const onSubmit = async (data: EditBoardData) => {
		if (!boardId) return

		setIsLoading(true)
		const res = await editBoardAction(data, boardId)

		if (isActionError(res)) {
			toast.error(res.error)
		} else {
			// Update local state
			const updatedBoards = boardsDropdown.map((board) => (board._id === boardId ? { ...board, ...data } : board))
			setBoardsDropdown(updatedBoards)
			mutateBoardsFn(updatedBoards)
			toast.success('Board updated successfully')
			onClose()
		}

		setIsLoading(false)
	}

	const onDelete = async () => {
		if (!boardId) return

		setIsLoading(true)
		const res = await deleteBoardAction(boardId)

		if (isActionError(res)) {
			toast.error(res.error)
		} else {
			// Update state
			const filteredBoards = boardsDropdown.filter((board) => board._id !== boardId)
			setBoardsDropdown(filteredBoards)
			mutateBoardsFn(filteredBoards)

			toast.success('Board deleted successfully')
			onClose()
		}

		setShowDeleteAlert(false)
		setIsLoading(false)
	}

	return (
		<>
			<Dialog open={isOpen} onOpenChange={onClose}>
				<DialogContent className="w-11/12 rounded-2xl sm:max-w-[540px] sm:rounded-2xl">
					<DialogHeader>
						<DialogTitle className="text-center text-2xl">Edit board</DialogTitle>
					</DialogHeader>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<div className={`grid gap-4 py-4 ${boardData?.coverImage ? 'grid-cols-1' : 'grid-cols-1'}`}>
								<div className="space-y-4">
									{boardData?.coverImage && (
										<div className="relative w-[140px] h-[140px] cursor-pointer">
											<Image
												src={boardData.coverImage}
												alt="Board cover"
												width={140}
												height={140}
												className="w-full h-full object-cover rounded-2xl"
											/>
											<Button
												size="icon"
												variant="secondary"
												className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60"
												onClick={(e) => {
													e.preventDefault()
												}}
											>
												<Pencil className="h-4 w-4" />
											</Button>
										</div>
									)}
									<FormField
										control={form.control}
										name="title"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Name</FormLabel>
												<FormControl>
													<Input
														placeholder="Enter board name"
														className="h-12 rounded-2xl"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="description"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Description</FormLabel>
												<FormControl>
													<Input
														placeholder="Enter board description"
														className="h-12 rounded-2xl"
														{...field}
														value={field.value || ''}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="secret"
										render={({ field }) => (
											<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-4">
												<div className="space-y-0.5">
													<FormLabel>Secret</FormLabel>
													<FormDescription>Make board private</FormDescription>
												</div>
												<FormControl>
													<Switch checked={field.value} onCheckedChange={field.onChange} />
												</FormControl>
											</FormItem>
										)}
									/>
								</div>
							</div>
							<DialogFooter className="gap-2 sm:gap-0">
								<Button
									type="button"
									variant="destructive"
									onClick={() => setShowDeleteAlert(true)}
									disabled={isLoading}
								>
									Delete
								</Button>
								<LoaderButton type="submit" isLoading={isLoading} disabled={!form.formState.isDirty}>
									Save
								</LoaderButton>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>

			<AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete your board and remove all pins
							associated with it.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={onDelete} className="bg-red-500 hover:bg-red-600">
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}
