'use client'

import { uploadToCloudinary } from '@/actions/cloudinary'
import { LoaderButton } from '@/components/loading-button'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarProvider,
	SidebarRail
} from '@/components/ui/sidebar'
import { Slider } from '@/components/ui/slider'
import { usePinTransModal } from '@/hooks/use-pin-trans-modal'
import { getPublicId } from '@/lib/utils'
import { useUser } from '@clerk/nextjs'
import { Cloudinary } from '@cloudinary/url-gen'
import {
	brightness as brightnessCld,
	contrast as contrastCld,
	saturation as saturationCld
} from '@cloudinary/url-gen/actions/adjust'
import { blackwhite, grayscale, sepia, vignette } from '@cloudinary/url-gen/actions/effect'
import { Loader2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider'
import { toast } from 'sonner'

export default function PinTransModal() {
	const { isOpen, onClose, imageFile, imagePreview, setImagePreview, currentImage } = usePinTransModal()
	const [transformedUrl, setTransformedUrl] = useState('')
	const [brightness, setBrightness] = useState(100)
	const [contrast, setContrast] = useState(100)
	const [saturation, setSaturation] = useState(100)
	const [blur, setBlur] = useState(0)
	const [selectedEffect, setSelectedEffect] = useState('')
	const [loading, setLoading] = useState(false)
	const cldUrl = useRef('')
	const { user } = useUser()

	// Initialize Cloudinary
	const cld = new Cloudinary({
		cloud: {
			cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
		},
		url: {
			secure: true
		}
	})

	const handleTransformation = async () => {
		if (!imageFile) return

		try {
			setLoading(true)

			if (!imagePreview?.includes('cloudinary')) {
				cldUrl.current = await uploadToCloudinary(imageFile, user!.id)
			}

			// Extract public ID from Cloudinary URL
			const publicId = getPublicId(cldUrl.current)
			if (!publicId) throw new Error('Invalid Cloudinary URL')

			// Create a new transformation
			let imageCld = cld.image(publicId)

			// Apply transformations based on slider values
			if (brightness !== 100) {
				imageCld = imageCld.adjust(brightnessCld().level(brightness - 100))
			}
			if (contrast !== 100) {
				imageCld = imageCld.adjust(contrastCld().level(contrast - 100))
			}
			if (saturation !== 100) {
				imageCld = imageCld.adjust(saturationCld().level(saturation - 100))
			}

			// Apply selected effect
			if (selectedEffect && selectedEffect !== 'None') {
				switch (selectedEffect.toLowerCase()) {
					case 'sepia':
						imageCld = imageCld.effect(sepia())
						break
					case 'grayscale':
						imageCld = imageCld.effect(grayscale())
						break
					case 'blackwhite':
						imageCld = imageCld.effect(blackwhite())
						break
					case 'vignette':
						imageCld = imageCld.effect(vignette())
						break
				}
			}

			// Generate the transformed URL
			const url = imageCld.toURL()
			setTransformedUrl(url)
			setImagePreview(url)
		} catch (error) {
			console.error('Transformation error:', error)
			toast.error('Error transforming image')
		} finally {
			setLoading(false)
		}
	}

	const handleSliderChange = (setter: (value: number) => void) => (value: number[]) => {
		setter(value[0])
	}

	const handleEffectChange = (effect: string) => {
		setSelectedEffect(effect)
	}

	return (
		<SidebarProvider>
			<Dialog open={isOpen} onOpenChange={onClose}>
				<DialogContent className="h-screen max-w-screen grid w-full grid-cols-[280px_1fr] gap-4 bg-gray-200">
					<Sidebar className="border-r">
						<SidebarHeader>
							<DialogTitle className="text-center text-2xl">Image Editor</DialogTitle>
							<DialogDescription>Enhance and transform your images</DialogDescription>
						</SidebarHeader>
						<SidebarContent>
							<SidebarGroup>
								<SidebarGroupContent>
									<div className="space-y-2">
										<Label htmlFor="brightness">Brightness</Label>
										<Slider
											id="brightness"
											defaultValue={[brightness]}
											min={0}
											max={200}
											step={1}
											onValueChange={handleSliderChange(setBrightness)}
										/>
										<Label htmlFor="contrast">Contrast</Label>
										<Slider
											id="contrast"
											defaultValue={[contrast]}
											min={0}
											max={200}
											step={1}
											onValueChange={handleSliderChange(setContrast)}
										/>
										<Label htmlFor="saturation">Saturation</Label>
										<Slider
											id="saturation"
											defaultValue={[saturation]}
											min={0}
											max={200}
											step={1}
											onValueChange={handleSliderChange(setSaturation)}
										/>
										<Label htmlFor="blur">Blur</Label>
										<Slider
											id="blur"
											defaultValue={[blur]}
											min={0}
											max={100}
											step={1}
											onValueChange={handleSliderChange(setBlur)}
										/>
									</div>
								</SidebarGroupContent>
							</SidebarGroup>
							<SidebarGroup>
								<SidebarGroupContent>
									<Select onValueChange={handleEffectChange}>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Select an effect" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="None">None</SelectItem>
											<SelectItem value="sepia">Sepia</SelectItem>
											<SelectItem value="grayscale">Grayscale</SelectItem>
											<SelectItem value="blackwhite">Black & White</SelectItem>
											<SelectItem value="vignette">Vignette</SelectItem>
										</SelectContent>
									</Select>
								</SidebarGroupContent>
							</SidebarGroup>
							<SidebarGroup>
								<SidebarGroupContent className="flex justify-end">
									<LoaderButton onClick={handleTransformation} isLoading={loading}>
										Transform
									</LoaderButton>
								</SidebarGroupContent>
							</SidebarGroup>
							<SidebarFooter>
								<Button onClick={onClose}>Close</Button>
							</SidebarFooter>
							<SidebarRail />
						</SidebarContent>
					</Sidebar>
					<div className="flex items-center justify-center">
						{transformedUrl && (
							<div className="relative">
								{imagePreview && (
									<ReactCompareSlider
										itemOne={<ReactCompareSliderImage src={currentImage!} />}
										itemTwo={<ReactCompareSliderImage src={transformedUrl || currentImage!} />}
										className="h-auto max-h-[685px] w-[500px] object-contain rounded-2xl"
									/>
								)}
								{loading && (
									<div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 rounded-2xl">
										<Loader2 className="h-10 w-10 animate-spin" color="#fff" />
									</div>
								)}
							</div>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</SidebarProvider>
	)
}
