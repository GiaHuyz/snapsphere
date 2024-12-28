'use client'

import { deletePinAction, editPinAction } from '@/actions/pin-actions'
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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useEditPinModal } from '@/hooks/use-edit-pin-modal'
import { usePinStore } from '@/hooks/use-pin-store'
import { isActionError } from '@/lib/errors'
import { checkUserPage } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import NextImage from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const editPinSchema = z.object({
	title: z.string().max(50, 'Title must be 50 characters or less').optional().or(z.literal('')),
	description: z.string().max(160, 'Description must be 160 characters or less').optional().or(z.literal('')),
	referenceLink: z.string().url().optional().or(z.literal('')),
	boardId: z.string().optional(),
	isAllowedComment: z.boolean().default(true)
})

type EditPinFormValues = z.infer<typeof editPinSchema>

export default function EditPinModal() {
	const { isOpen, onClose, pin } = useEditPinModal()
	const { pins, setPins } = usePinStore()
	const [isLoading, setIsLoading] = useState(false)
	const [showDeleteAlert, setShowDeleteAlert] = useState(false)
	const [formValues, setFormValues] = useState<EditPinFormValues | null>(null)
	const pathname = usePathname()

	const form = useForm<EditPinFormValues>({
		resolver: zodResolver(editPinSchema),
		defaultValues: {
			title: '',
			description: '',
			referenceLink: '',
			boardId: '',
			isAllowedComment: true
		}
	})

	useEffect(() => {
		if (pin) {
			const initialValues = {
				title: pin.title,
				description: pin.description,
				referenceLink: pin.referenceLink,
				isAllowedComment: pin.isAllowedComment,
				boardId: ''
			}
			setFormValues(initialValues)
			form.reset(initialValues)
		}
	}, [pin, form])

	const hasChanges = () => {
		if (!formValues || !pin) return false
		const currentValues = form.getValues()
		return (
			currentValues.title !== formValues.title ||
			currentValues.description !== formValues.description ||
			currentValues.referenceLink !== formValues.referenceLink ||
			currentValues.isAllowedComment !== formValues.isAllowedComment ||
			currentValues.boardId !== formValues.boardId
		)
	}

	async function onSubmit(data: EditPinFormValues) {
		if (!pin) return

		delete data.boardId

		setIsLoading(true)
		const res = await editPinAction({
			_id: pin._id,
			...data
		})

		if (isActionError(res)) {
			toast.error(res.error)
		} else {
			toast.success('Pin updated successfully!')
			onClose()
			const updatedPins = pins.map((p) => (p._id === pin._id ? res : p))
			setPins(updatedPins)
		}
		setIsLoading(false)
	}

	const onDelete = async () => {
		setIsLoading(true)
		const res = await deletePinAction(pin!._id)

		if (isActionError(res)) {
			toast.error(res.error)
		} else {
			toast.success('Pin deleted successfully')
			onClose()
			if (checkUserPage(pathname)) {
				const updatedPins = pins.filter((p) => p._id !== pin!._id)
				setPins(updatedPins)
			}
		}

		setShowDeleteAlert(false)
		setIsLoading(false)
	}

	if (!pin) return null

	return (
		<>
			<Dialog open={isOpen} onOpenChange={onClose}>
				<DialogContent className="w-11/12 rounded-2xl sm:rounded-2xl sm:max-w-[900px] max-h-[calc(100vh-64px)] overflow-y-auto">
					<DialogHeader>
						<DialogTitle className="text-center text-2xl">Edit Pin</DialogTitle>
					</DialogHeader>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<div className="grid gap-8 md:grid-cols-[236px,1fr]">
								{/* Left: Image */}
								<div className="space-y-4 mt-2">
									<div className="relative">
										<NextImage
											src={pin.url}
											alt="Pin image"
											width={236}
											height={236}
											className="w-full rounded-3xl object-cover max-h-[508px]"
										/>
									</div>
								</div>

								{/* Right: Form Fields */}
								<div className="space-y-6">
									<FormField
										control={form.control}
										name="title"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Title</FormLabel>
												<FormControl>
													<Input placeholder="Add a title" {...field} />
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
													<Textarea
														placeholder="Add a detailed description"
														className="min-h-[100px] resize-none"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="referenceLink"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Link</FormLabel>
												<FormControl>
													<Input type="url" placeholder="Add a link" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="isAllowedComment"
										render={({ field }) => (
											<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
												<div className="space-y-0.5">
													<FormLabel className="text-base">Allow people to comment</FormLabel>
													<FormDescription>
														Enable or disable comments on this pin
													</FormDescription>
												</div>
												<FormControl>
													<Switch checked={field.value} onCheckedChange={field.onChange} />
												</FormControl>
											</FormItem>
										)}
									/>
								</div>
							</div>
							<DialogFooter className="flex gap-2 justify-between sm:justify-between">
								<LoaderButton
									type="button"
									className="rounded-full bg-red-500 hover:bg-red-600"
									onClick={() => setShowDeleteAlert(true)}
									isLoading={isLoading}
								>
									Delete
								</LoaderButton>
								<LoaderButton
									type="submit"
									disabled={!hasChanges()}
									className="rounded-full"
									isLoading={isLoading}
								>
									Update
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
