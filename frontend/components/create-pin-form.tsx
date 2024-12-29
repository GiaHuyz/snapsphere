'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDown, CircleX, Pencil, TriangleAlert, Upload } from 'lucide-react'
import NextImage from 'next/image'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Board } from '@/actions/board-actions'
import { createPin, savePinToBoardAction } from '@/actions/pin-actions'
import BoardDropdown from '@/components/board-dropdown'
import { LoaderButton } from '@/components/loading-button'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { usePinTransModal } from '@/hooks/use-pin-trans-modal'
import { isActionError } from '@/lib/errors'
import { toast } from 'sonner'

export const createPinSchema = z.object({
	title: z.string().max(50, 'Title must be 50 characters or less').optional(),
	description: z.string().max(160, 'Description must be 160 characters or less').optional().or(z.literal('')),
	referenceLink: z.string().url().optional().or(z.literal('')),
	boardId: z.string().optional().or(z.literal('')),
	isAllowedComment: z.boolean().default(true),
	secret: z.boolean().default(false)
})

type CreatePinFormValues = z.infer<typeof createPinSchema>

export default function CreatePinForm({ boardsDropdown }: { boardsDropdown: Board[] }) {
	const [isLoading, setIsLoading] = useState(false)
	const [imageFile, setImageFile] = useState<File | null>(null)
	const [errorUpload, setErrorUpload] = useState<string | null>(null)
	const [selectedBoard, setSelectedBoard] = useState<Board | null>(null)
	const { onOpen, onClose, imagePreview, setImagePreview, setCurrentImage } = usePinTransModal()

	const form = useForm<CreatePinFormValues>({
		resolver: zodResolver(createPinSchema),
		defaultValues: {
			title: '',
			description: '',
			referenceLink: '',
			boardId: '',
			isAllowedComment: true,
			secret: false
		}
	})

	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			const file = acceptedFiles[0]
			if (file) {
				if (file.size > 20 * 1024 * 1024) {
					toast.error('Image too large. Please upload an image less than 20 MB in size.')
					return
				}

				const image = new Image()

				image.onload = async () => {
					if (image.width < 200 || image.height < 300) {
						toast.error('Image too small. Please upload an image with a minimum size of 200x300.')
						setErrorUpload('Image too small. Please upload an image with a minimum size of 200x300.')
						return
					} else {
						setErrorUpload(null)
						setImageFile(file)
						const preview = URL.createObjectURL(file)
						setCurrentImage(preview)
						setImagePreview(preview)
					}
				}

				image.src = URL.createObjectURL(file)
			}
		},
		[setCurrentImage, setImagePreview]
	)

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			'image/*': []
		},
		maxFiles: 1
	})

	async function onSubmit(data: CreatePinFormValues) {
		if (!imageFile) {
			toast.error('Please upload an image')
			return
		}

		setIsLoading(true)
		const formData = new FormData()

		const optionalKeys: (keyof CreatePinFormValues)[] = ['title', 'description', 'referenceLink']
		optionalKeys.forEach((key) => {
			if (data[key]) {
				formData.append(key, data[key] as string)
			}
		})

		formData.append('isAllowedComment', data.isAllowedComment.toString())

		if (imagePreview?.includes('cloudinary')) {
			formData.append('url', imagePreview)
		} else {
			formData.append('image', imageFile)
		}

		const res = await createPin(formData)

		if (isActionError(res)) {
			toast.error(res.error)
		} else {
			if (selectedBoard) {
				await savePinToBoardAction({
					pin_id: res._id,
					board_id: selectedBoard._id
				})
			}
			toast.success('Pin created successfully')
			form.reset()
			setImageFile(null)
			setImagePreview(null)
		}

		setIsLoading(false)
	}

	const handleBoardChange = (board: Board) => {
		setSelectedBoard(board)
		form.setValue('boardId', board._id)
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" encType="multipart/form-data">
				<div className="grid gap-8 md:grid-cols-[350px,1fr]">
					{/* Left: Image Upload */}
					<div className="space-y-4">
						{!imagePreview && (
							<div
								{...getRootProps()}
								className={`flex min-h-[400px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed ${
									isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
								} ${errorUpload ? 'border-red-500 bg-red-500/5' : ''}`}
							>
								<input {...getInputProps()} />
								<div className="flex flex-col items-center gap-2 p-8 text-center">
									<div className={`rounded-full ${errorUpload ? 'bg-red-500' : 'bg-muted'} p-4`}>
										{errorUpload ? (
											<TriangleAlert className="h-6 w-6" />
										) : (
											<Upload className="h-6 w-6" />
										)}
									</div>
									<p className={`font-medium ${errorUpload && 'text-red-500'}`}>
										{errorUpload || 'Choose a file or drag and drop it here'}
									</p>
									<p className="text-sm text-muted-foreground">
										We recommend using high quality .jpg files less than 20 MB
									</p>
								</div>
							</div>
						)}
						{imagePreview && (
							<div className="relative">
								<NextImage
									src={imagePreview}
									alt="Pin preview"
									width={400}
									height={400}
									className="w-full max-h-[685px] rounded-3xl object-fill"
								/>
								<div className="absolute right-4 left-4 top-4 z-10 flex justify-between">
									<Button
										type="button"
										size="icon"
										className="rounded-full bg-white text-black backdrop-blur-sm hover:bg-white/60"
										onClick={(e) => {
											e.stopPropagation()
											setImageFile(null)
											setImagePreview(null)
											setCurrentImage(null)
											onClose()
										}}
									>
										<CircleX className="h-4 w-4" />
									</Button>
									<Button
										type="button"
										size="icon"
										className="rounded-full bg-white text-black backdrop-blur-sm hover:bg-white/60"
										onClick={(e) => {
											e.stopPropagation()
											onOpen(imageFile)
										}}
									>
										<Pencil className="h-4 w-4" />
									</Button>
								</div>
							</div>
						)}
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
							name="boardId"
							render={() => (
								<FormItem>
									<FormLabel>Board</FormLabel>
									<FormControl>
										<BoardDropdown
											boardsDropdown={boardsDropdown}
											mode="select"
											onChange={handleBoardChange}
										>
											<Button
												type="button"
												variant="outline"
												role="combobox"
												className={`mt-1 px-3 h-12 w-full justify-between rounded-2xl`}
											>
												<div className="flex items-center gap-2">
													{selectedBoard ? (
														<>
															{selectedBoard.coverImages?.[0] && (
																<div className="h-7 w-7 overflow-hidden rounded-md">
																	<NextImage
																		src={selectedBoard.coverImages[0].url}
																		alt={selectedBoard.title}
																		width={24}
																		height={24}
																		className="h-full w-full object-cover"
																	/>
																</div>
															)}
															<span>{selectedBoard.title}</span>
														</>
													) : (
														'Choose a board'
													)}
												</div>
												<ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
											</Button>
										</BoardDropdown>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="isAllowedComment"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center justify-between rounded-lg">
									<div className="space-y-0.5">
										<FormLabel className="text-base">Allow people to comment</FormLabel>
									</div>
									<FormControl>
										<Switch checked={field.value} onCheckedChange={field.onChange} />
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="secret"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center justify-between rounded-lg">
									<div className="space-y-0.5">
										<FormLabel className="text-base">Secret</FormLabel>
									</div>
									<FormControl>
										<Switch checked={field.value} onCheckedChange={field.onChange} />
									</FormControl>
								</FormItem>
							)}
						/>
						<div className="flex justify-end">
							<LoaderButton
								type="submit"
								isLoading={isLoading}
								className="rounded-full bg-red-500 hover:bg-red-600"
							>
								Publish
							</LoaderButton>
						</div>
					</div>
				</div>
			</form>
		</Form>
	)
}
