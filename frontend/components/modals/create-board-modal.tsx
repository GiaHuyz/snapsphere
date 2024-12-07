'use client'

import { Board, createBoard } from '@/actions/board-actions'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useCreateBoardModal } from '@/hooks/use-create-board-modal'
import { useToast } from '@/hooks/use-toast'
import { useBoardStore } from '@/provider/board-provider'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const formSchema = z.object({
	title: z.string().min(1, 'Board name is required').max(50, 'Board name must be 50 characters or less'),
	secret: z.boolean().default(false),
	image: z.string().optional()
})

type FormData = z.infer<typeof formSchema>

export function CreateBoardModal() {
	const { isOpen, onClose, image } = useCreateBoardModal()
	const [isLoading, setIsLoading] = useState(false)
	const { toast } = useToast()
	const { boardsDropdown, boardPreviews, setBoardsDropdown, setBoardPreviews } = useBoardStore()

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
			secret: false
		}
	})

	const onSubmit = async (data: FormData) => {
		setIsLoading(true)
		try {
			const result = await createBoard({ ...data, image })
			if (result.success) {
				toast({
					title: 'Board created',
					description: 'Your new board has been created successfully.',
					variant: 'success'
				})
				setBoardsDropdown([...boardsDropdown, result.newBoard as Board])
				setBoardPreviews([...boardPreviews, result.newBoard as Board])
				onClose()
				form.reset()
			} else {
				throw new Error(result.error || 'Failed to create board')
			}
		} catch (error) {
			toast({
				title: 'Error',
				description: (error as Error).message || 'An error occurred while creating the board.',
				variant: 'destructive'
			})
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent
				className={`w-11/12 rounded-2xl ${image ? 'sm:max-w-[720px]' : 'sm:max-w-[480px]'} sm:rounded-2xl`}
			>
				<DialogHeader>
					<DialogTitle className="text-center text-2xl">Create Board</DialogTitle>
				</DialogHeader>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className={`grid gap-4 py-4 ${image ? 'grid-cols-[240px,1fr]' : ''}`}>
						{image && (
							<div>
								<Image
									src={image}
									alt="Board cover"
									width={200}
									height={150}
									className="w-full object-cover rounded-2xl"
								/>
							</div>
						)}
						<div className={image ? 'grid-cols-1' : ''}>
							<div className="mb-4">
								<Label htmlFor="name" className="text-right">
									Name
								</Label>
								<Input
									id="title"
									placeholder="Enter board name"
									className="h-12 rounded-2xl"
									{...form.register('title')}
								/>
								{form.formState.errors.title && (
									<p className="text-sm text-red-500 mt-1">{form.formState.errors.title.message}</p>
								)}
							</div>
							<div className="flex items-center gap-2">
								<Label htmlFor="secret">Secret</Label>
								<Switch id="secret" {...form.register('secret')} />
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button type="submit" disabled={isLoading}>
							{isLoading ? 'Creating...' : 'Create'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
