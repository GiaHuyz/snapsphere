'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import usePreviewAvatarImage from '@/hooks/use-preview-image'
import { useUserStore } from '@/provider/user-provider'
import { useUser } from '@clerk/nextjs'
import { User } from '@clerk/nextjs/server'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const profileSchema = z.object({
	firstName: z.string().min(2, 'First name must be at least 2 characters.'),
	lastName: z.string().min(2, 'Last name must be at least 2 characters.'),
	username: z
		.string()
		.min(3, 'Username must be at least 3 characters.')
		.regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores.'),
	bio: z.string().max(160, 'Bio must not be longer than 160 characters.').optional(),
	website: z.string().url('Please enter a valid URL').optional().or(z.literal(''))
})

type ProfileFormValues = z.infer<typeof profileSchema>

export function ProfileForm() {
	const { user: currentUser } = useUserStore()
    const initUser = currentUser as User
	const { user } = useUser()
	const [isLoading, setIsLoading] = useState(false)
	const { previewImage, handleFileChange } = usePreviewAvatarImage()
	const imageRef = useRef<HTMLInputElement>(null)

	const form = useForm<ProfileFormValues>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			firstName: initUser.firstName || '',
			lastName: initUser.lastName || '',
			username: initUser.username || '',
			bio: (initUser.unsafeMetadata?.bio as string) || '',
			website: (initUser.unsafeMetadata?.website as string) || ''
		}
	})

	const onSubmit = async (data: ProfileFormValues) => {
		setIsLoading(true)
		try {
			if (form.formState.isDirty && user) {
				await user.update({
					firstName: data.firstName,
					lastName: data.lastName,
					username: data.username,
					unsafeMetadata: {
						bio: data.bio,
						website: data.website
					}
				})
			}

			if (previewImage && user) {
				await user.setProfileImage({ file: previewImage })
			}

			toast.success('Profile updated successfully!')
		} catch (error) {
			toast.error(error as string)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<div className="space-y-2">
					<FormLabel>Photo</FormLabel>
					<div className="flex items-center gap-4">
						<div className="relative h-16 w-16 overflow-hidden rounded-full">
							<Image
								src={previewImage || initUser.imageUrl}
								alt={initUser.username || 'Profile picture'}
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
						<Button type="button" variant="secondary" onClick={() => imageRef.current?.click()}>
							Change
						</Button>
					</div>
				</div>

				<div className="grid gap-4 sm:grid-cols-2">
					<FormField
						control={form.control}
						name="firstName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>First name</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="lastName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Last name</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<FormField
					control={form.control}
					name="bio"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Bio</FormLabel>
							<FormControl>
								<Textarea {...field} placeholder="Tell us about yourself" className="resize-none" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="website"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Website</FormLabel>
							<FormControl>
								<Input type="url" placeholder="https://" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Username</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormDescription>www.snapsphere.com/{field.value}</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="flex justify-end">
					<Button type="submit" disabled={isLoading || (!form.formState.isDirty && !previewImage)}>
						{isLoading ? (
							<div className="flex items-center gap-2">
								<Loader2 className="w-4 h-4 animate-spin" />
								Saving...
							</div>
						) : (
							'Save'
						)}
					</Button>
				</div>
			</form>
		</Form>
	)
}
