'use client'

import { fetchImageFromUrl } from '@/actions/pin-actions'
import { LoaderButton } from '@/components/loading-button'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { usePinTransModal } from '@/hooks/use-pin-trans-modal'
import { useSaveFromUrlModal } from '@/hooks/use-save-from-url-modal'
import { isActionError } from '@/lib/errors'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const saveFromUrlSchema = z.object({
	url: z.string().url('Invalid URL')
})

type saveFromUrlData = z.infer<typeof saveFromUrlSchema>

export function SaveFromUrlModal() {
	const [isLoading, setIsLoading] = useState(false)
	const { isOpen, onClose } = useSaveFromUrlModal()
	const { setImagePreview, setCurrentImage, setImageFile } = usePinTransModal()
	const form = useForm<saveFromUrlData>({
		resolver: zodResolver(saveFromUrlSchema),
        defaultValues: {
            url: ''
        }
	})

	const onSubmit = async (data: saveFromUrlData) => {
		setIsLoading(true)
		const result = await fetchImageFromUrl(data.url)

		if (isActionError(result)) {
			setIsLoading(false)
			return toast.error(result.error)
		}

		const response = await fetch(result)
		const blob = await response.blob()
		const file = new File([blob], 'image_from_url', { type: blob.type })
		setImageFile(file)
		setImagePreview(result)
		setCurrentImage(result)
		setIsLoading(false)
		onClose()
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Save image from URL</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className="grid gap-4 py-4">
							<FormField
                                control={form.control}
                                name="url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>URL</FormLabel>
                                        <Input placeholder="https://example.com/image.jpg" {...field} />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
						</div>
						<DialogFooter>
							<Button type="button" variant="outline" onClick={onClose}>
								Cancel
							</Button>
							<LoaderButton type='submit' isLoading={isLoading}>
								Save
							</LoaderButton>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
