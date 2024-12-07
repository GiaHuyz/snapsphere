'use client'

import { useUser } from '@clerk/nextjs'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import usePreviewAvatarImage from '@/hooks/use-preview-image'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

const profileSchema = z.object({
	firstName: z.string().min(2, {
		message: 'First name must be at least 2 characters.'
	}),
	lastName: z.string().min(2, {
		message: 'Last name must be at least 2 characters.'
	}),
	bio: z
		.string()
		.max(160, {
			message: 'Bio must not be longer than 160 characters.'
		})
		.optional(),
	website: z
		.string()
		.url({
			message: 'Please enter a valid URL.'
		})
		.optional()
		.or(z.literal('')),
	username: z
		.string()
		.min(3, {
			message: 'Username must be at least 3 characters.'
		})
		.regex(/^[a-zA-Z0-9_]+$/, {
			message: 'Username can only contain letters, numbers, and underscores.'
		})
})

type ProfileFormValues = z.infer<typeof profileSchema>

export default function ProfilePage() {
	const { isLoaded, user } = useUser()
	const { toast } = useToast()
	const [isLoading, setIsLoading] = useState(false)
	const [isChangingForm, setIsChangingForm] = useState(false)
	const { previewImage, handleFileChange } = usePreviewAvatarImage()
	const imageRef = useRef<HTMLInputElement>(null)
	const currentUserInfo = useRef<ProfileFormValues>({
		firstName: '',
		lastName: '',
		username: '',
		bio: '',
		website: ''
	})

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
		watch
	} = useForm<ProfileFormValues>({
		resolver: zodResolver(profileSchema),
		defaultValues: currentUserInfo.current,
		mode: 'onBlur'
	})

	const formValues = watch()

	useEffect(() => {
		if (user) {
			currentUserInfo.current = {
				firstName: user.firstName as string,
				lastName: user.lastName as string,
				username: user.username as string,
				bio: (user.unsafeMetadata?.bio as string) || '',
				website: (user.unsafeMetadata?.website as string) || ''
			}
			reset(currentUserInfo.current)
		}
	}, [user, reset])

	useEffect(() => {
		if (!user) return

		const currentValues = currentUserInfo.current

		const isChanged = Object.keys(currentValues).some(
			(key) =>
				currentValues[key as keyof ProfileFormValues] !== formValues[key as keyof ProfileFormValues] ||
				previewImage
		)
		setIsChangingForm(isChanged)
	}, [user, formValues, previewImage])

	if (!isLoaded) {
		return (
			<div className="flex items-center justify-center mt-60">
				<Loader2 className="w-10 h-10" />
			</div>
		)
	}

	async function onSubmit(data: ProfileFormValues) {
		try {
			setIsLoading(true)

			// Update user metadata

			if (isChangingForm && !previewImage) {
				await user?.update({
					firstName: data.firstName,
					lastName: data.lastName,
					username: data.username,
					unsafeMetadata: {
						bio: data.bio,
						website: data.website
					}
				})
			}

			if (previewImage) {
				await user?.setProfileImage({ file: previewImage })
			}

			toast({
				title: 'Profile updated',
				description: 'Your profile has been updated successfully.',
				variant: 'success'
			})
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			toast({
				title: 'Error',
				description: (error as Error).message || 'Something went wrong. Please try again.',
				variant: 'destructive'
			})
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="container max-w-2xl py-8 px-5 mx-auto">
			<div className="space-y-6">
				<div>
					<h1 className="text-2xl font-bold">Edit profile</h1>
					<p className="text-sm text-muted-foreground max-w-[400px]">
						Keep your personal details private. Information you add here is visible to anyone who can view
						your profile.
					</p>
				</div>

				<div className="space-y-2">
					<label className="text-sm font-medium">Photo</label>
					<div className="flex items-center gap-4">
						<div className="relative h-16 w-16 overflow-hidden rounded-full">
							<Image
								src={previewImage || user?.imageUrl || '/avatar-default.svg'}
								alt={user?.username || 'Profile picture'}
								fill
								className="object-cover"
							/>
						</div>
						<input
							type="file"
							accept="image/*"
							className="hidden"
							onChange={handleFileChange}
							ref={imageRef}
						/>
						<Button variant="secondary" onClick={() => imageRef.current?.click()}>
							Change
						</Button>
					</div>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<div className="grid gap-4 sm:grid-cols-2">
						<div>
							<label htmlFor="firstName" className="block text-sm font-medium">
								First name
							</label>
							<Controller
								name="firstName"
								control={control}
								render={({ field }) => <Input id="firstName" {...field} className="mt-1" />}
							/>
							{errors.firstName && (
								<p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
							)}
						</div>
						<div>
							<label htmlFor="lastName" className="block text-sm font-medium">
								Last name
							</label>
							<Controller
								name="lastName"
								control={control}
								render={({ field }) => <Input id="lastName" {...field} className="mt-1" />}
							/>
							{errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>}
						</div>
					</div>

					<div>
						<label htmlFor="about" className="block text-sm font-medium">
							About
						</label>
						<Controller
							name="bio"
							control={control}
							render={({ field }) => (
								<Textarea
									id="about"
									{...field}
									placeholder="Tell us about yourself"
									className="mt-1 resize-none"
								/>
							)}
						/>
						{errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>}
					</div>

					<div>
						<label htmlFor="website" className="block text-sm font-medium">
							Website
						</label>
						<Controller
							name="website"
							control={control}
							render={({ field }) => (
								<Input id="website" type="url" placeholder="https://" {...field} className="mt-1" />
							)}
						/>
						{errors.website && <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>}
					</div>

					<div>
						<label htmlFor="username" className="block text-sm font-medium">
							Username
						</label>
						<Controller
							name="username"
							control={control}
							render={({ field }) => <Input id="username" {...field} className="mt-1" />}
						/>
						{errors.username && <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>}
						<p className="mt-1 text-sm text-muted-foreground">www.snapsphere.com/dragonelga90</p>
					</div>

					<div className="text-right">
						<Button type="submit" disabled={isLoading || !isChangingForm}>
							{isLoading ? (
								<div className="flex items-center gap-2">
									<Loader2 className="w-4 h-4" />
									Saving...
								</div>
							) : (
								'Save'
							)}
						</Button>
					</div>
				</form>
			</div>
		</div>
	)
}
