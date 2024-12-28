'use client'

import { createBoardAction } from '@/actions/board-actions'
import { savePinToBoardAction } from '@/actions/pin-actions'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { useBoardDropdownStore } from '@/hooks/use-board-dropdown-store'
import { useBoardPreviewStore } from '@/hooks/use-board-preview-store'
import { useCreateBoardModal } from '@/hooks/use-create-board-modal'
import { isActionError } from '@/lib/errors'
import { checkUserPage } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

export const createBoardSchema = z.object({
	title: z.string().min(1, 'Board name is required').max(50, 'Board name must be 50 characters or less'),
	secret: z.boolean().default(false),
	coverImageIds: z.array(z.string()).optional(),
	description: z.string().max(160, 'Description must be 160 characters or less').optional()
})

export type createBoardData = z.infer<typeof createBoardSchema>

export default function CreateBoardModal() {
	const { isOpen, onClose, pin } = useCreateBoardModal()
	const { boards, setBoards } = useBoardDropdownStore()
	const { boardsPreview, setBoardsPreview } = useBoardPreviewStore()
	const [isLoading, setIsLoading] = useState(false)
	const pathname = usePathname()

	const form = useForm<createBoardData>({
		resolver: zodResolver(createBoardSchema),
		defaultValues: {
			title: '',
			description: '',
			secret: false
		}
	})

	const onSubmit = async (data: createBoardData) => {
		setIsLoading(true)

		const newBoard = await createBoardAction(data)

		if (isActionError(newBoard)) {
			toast.error(newBoard.error)
		} else {
			toast.success('Board created')
			onClose()
			form.reset()
			if (pin?._id) {
				await savePinToBoardAction({
					pin_id: pin._id,
					board_id: newBoard._id
				})
                if(newBoard.coverImages.length < 3) {
                    newBoard.coverImages.push({
                        _id: pin._id,
                        url: pin.url
                    })
                    newBoard.pinCount++
                }
			}
            setBoards([newBoard, ...boards])
			if (checkUserPage(pathname)) {
				setBoardsPreview([newBoard, ...boardsPreview])
			}
		}

		setIsLoading(false)
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent
				className={`w-11/12 rounded-2xl ${
					pin?.url ? 'sm:max-w-[720px]' : 'sm:max-w-[480px]'
				} sm:rounded-2xl max-h-[calc(100vh-64px)] overflow-y-auto`}
			>
				<DialogHeader>
					<DialogTitle className="text-center text-2xl">Create Board</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className={`grid gap-4 py-4 ${pin?.url ? 'grid-cols-[240px,1fr]' : ''}`}>
							{pin?.url && (
								<div>
									<Image
										src={pin?.url}
										alt="Board cover"
										width={200}
										height={150}
										className="w-full object-cover rounded-2xl max-h-[508px]"
									/>
								</div>
							)}
							<div className={pin?.url ? 'grid-cols-1' : ''}>
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
										<FormItem className="mt-4">
											<FormLabel>Description</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter board description"
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
						<DialogFooter>
							<Button type="submit" disabled={isLoading}>
								{isLoading ? 'Creating...' : 'Create'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
