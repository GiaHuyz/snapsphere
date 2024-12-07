'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDown, CircleX, Pencil, TriangleAlert, Upload } from 'lucide-react'
import NextImage from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import BoardDropdown from '@/components/board-dropdown'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Board } from '@/actions/board-actions'

const createPinSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	description: z.string(),
	link: z.string().url().optional().or(z.literal('')),
	boardId: z.string(),
	allowComments: z.boolean().default(true)
})

type CreatePinFormValues = z.infer<typeof createPinSchema>

export default function CreatePinForm() {
	const router = useRouter()
	const { toast } = useToast()
	const [isLoading, setIsLoading] = useState(false)
	const [imageFile, setImageFile] = useState<File | null>(null)
	const [imagePreview, setImagePreview] = useState<string | null>(null)
	const [errorUpload, setErrorUpload] = useState<string | null>(null)
	const [selectedBoard, setSelectedBoard] = useState<Board | null>(null)

	const {
		control,
		handleSubmit,
		formState: { errors },
		setValue
	} = useForm<CreatePinFormValues>({
		resolver: zodResolver(createPinSchema),
		defaultValues: {
			title: '',
			description: '',
			link: '',
			boardId: '',
			allowComments: true
		}
	})

	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			const file = acceptedFiles[0]
			if (file) {
				if (file.size > 20 * 1024 * 1024) {
					toast({
						title: 'File too large',
						description: 'Please upload an image less than 20MB.',
						variant: 'destructive'
					})
					return
				}

				const image = new Image()

				image.onload = () => {
					if (image.width < 200 || image.height < 300) {
						toast({
							title: 'Image too small',
							description: 'Please upload an image with a minimum size of 200x300.',
							variant: 'destructive'
						})
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
		},
		[toast]
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
			toast({
				title: 'Image required',
				description: 'Please upload an image for your pin.',
				variant: 'destructive'
			})
			return
		}

		try {
			setIsLoading(true)

			// TODO: Implement the actual API call to create the pin
			console.log('Creating pin:', { ...data, imageFile })

			// Simulating API call
			await new Promise((resolve) => setTimeout(resolve, 2000))

			toast({
				title: 'Pin created',
				description: 'Your pin has been created successfully.'
			})

			router.push('/')
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Something went wrong. Please try again.',
				variant: 'destructive'
			})
		} finally {
			setIsLoading(false)
		}
	}

	const handleBoardChange = (board: Board) => {
		setSelectedBoard(board)
		setValue('boardId', board.id)
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
					<div>
						<label className="block text-sm font-medium">Title</label>
						<Controller
							name="title"
							control={control}
							render={({ field }) => (
								<Input placeholder="Add a title" className="mt-1 rounded-2xl" {...field} />
							)}
						/>
						{errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
					</div>

					<div>
						<label className="block text-sm font-medium">Description</label>
						<Controller
							name="description"
							control={control}
							render={({ field }) => (
								<Textarea
									placeholder="Add a detailed description"
									className="min-h-[100px] resize-none mt-1 rounded-2xl"
									{...field}
								/>
							)}
						/>
					</div>

					<div>
						<label className="block text-sm font-medium">Link</label>
						<Controller
							name="link"
							control={control}
							render={({ field }) => (
								<Input type="url" placeholder="Add a link" className="mt-1 rounded-2xl" {...field} />
							)}
						/>
						{errors.link && <p className="mt-1 text-sm text-red-500">{errors.link.message}</p>}
					</div>

					<div>
						<label className="block text-sm font-medium">Board</label>
						<Controller
							name="boardId"
							control={control}
							render={() => (
								<BoardDropdown mode="select" onChange={handleBoardChange}>
									<Button
                                        type='button'
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
							)}
						/>
						{errors.boardId && <p className="mt-1 text-sm text-red-500">{errors.boardId.message}</p>}
					</div>

					<div className="flex items-center justify-between pt-4">
						<label htmlFor="allowComments" className="text-md">
							Allow people to comment
						</label>
						<Controller
							name="allowComments"
							control={control}
							render={({ field }) => (
								<Switch id="allowComments" checked={field.value} onCheckedChange={field.onChange} />
							)}
						/>
					</div>
				</div>
			</div>
            <div className="flex justify-end">
				<Button type="submit" disabled={isLoading} className="rounded-full bg-red-500 hover:bg-red-600">
					{isLoading ? 'Creating...' : 'Publish'}
				</Button>
			</div>
		</form>
	)
}
