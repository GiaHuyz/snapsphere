'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDown, CircleX, Pencil, TriangleAlert, Upload } from 'lucide-react'
import NextImage from 'next/image'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Board } from '@/actions/board-actions'
import { createPin } from '@/actions/pin-actions'
import BoardDropdown from '@/components/board-dropdown'
import { LoaderButton } from '@/components/loading-button'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { isActionError } from '@/lib/errors'
import { toast } from 'sonner'

const createPinSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	description: z.string().optional().or(z.literal('')),
	link: z.string().url().optional().or(z.literal('')),
	boardId: z.string(),
	allowComments: z.boolean().default(true)
})

type CreatePinFormValues = z.infer<typeof createPinSchema>

export default function CreatePinForm() {
	const [isLoading, setIsLoading] = useState(false)
	const [imageFile, setImageFile] = useState<File | null>(null)
	const [imagePreview, setImagePreview] = useState<string | null>(null)
	const [errorUpload, setErrorUpload] = useState<string | null>(null)
	const [selectedBoard, setSelectedBoard] = useState<Board | null>(null)

	const form = useForm<CreatePinFormValues>({
		resolver: zodResolver(createPinSchema),
		defaultValues: {
			title: '',
			description: '',
			link: '',
			boardId: '',
			allowComments: true
		}
	})

	const onDrop = useCallback((acceptedFiles: File[]) => {
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
					setImagePreview(preview)
				}
			}

			image.src = URL.createObjectURL(file)
		}
	}, [])

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			'image/*': []
		},
		maxFiles: 1
	})

	async function onSubmit(data: CreatePinFormValues) {
        if (!selectedBoard) {
            form.setError('boardId', { message: 'Please select a board' })
			return
		}
        
		if (!imageFile) {
            toast.error('Please upload an image')
			return
		}
        
        setIsLoading(true)
		const formData = new FormData()
		formData.append('title', data.title)
		formData.append('board_id', data.boardId)
		formData.append('isAllowedComment', data.allowComments.toString())
		formData.append('image', imageFile)

		if (data.description) {
			formData.append('description', data.description)
		}
		if (data.link) {
			formData.append('link', data.link)
		}

		const res = await createPin(formData)

		if (isActionError(res)) {
			toast.error(res.error)
		} else {
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
									className="w-full max-h-[685px] rounded-3xl object-cover"
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
							name="link"
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
										<BoardDropdown mode="select" onChange={handleBoardChange}>
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
																		src={selectedBoard.coverImages[0]}
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
							name="allowComments"
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
					</div>
				</div>
				<div className="flex justify-end">
					<LoaderButton
						type="submit"
						isLoading={isLoading}
						className="rounded-full bg-red-500 hover:bg-red-600"
					>
						Publish
					</LoaderButton>
				</div>
			</form>
		</Form>
	)
}
