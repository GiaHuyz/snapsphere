'use client'

import { uploadToCloudinary } from '@/actions/cloudinary'
import { LoaderButton } from '@/components/loading-button'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { usePinTransModal } from '@/hooks/use-pin-trans-modal'
import { getPublicId } from '@/lib/utils'
import { useUser } from '@clerk/nextjs'
import { Cloudinary } from '@cloudinary/url-gen'
import {
	brightness as brightnessCld,
	contrast as contrastCld,
	improve,
	saturation as saturationCld,
	sharpen
} from '@cloudinary/url-gen/actions/adjust'
import {
	artisticFilter,
	blackwhite,
	blur as blurEffect,
	cartoonify,
	colorize,
	grayscale,
	negate,
	oilPaint,
	pixelate,
	sepia,
	vignette
} from '@cloudinary/url-gen/actions/effect'
import { Loader2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider'
import { toast } from 'sonner'

export default function PinTransModal() {
	const { isOpen, onClose, imageFile, imagePreview, setImagePreview, currentImage } = usePinTransModal()
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
			if (blur !== 0) {
				imageCld = imageCld.effect(blurEffect().strength(blur))
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
					case 'vintage':
						imageCld = imageCld.effect(artisticFilter('vintage'))
						break
					case 'al_dente':
						imageCld = imageCld.effect(artisticFilter('al_dente'))
						break
					case 'athena':
						imageCld = imageCld.effect(artisticFilter('athena'))
						break
					case 'audrey':
						imageCld = imageCld.effect(artisticFilter('audrey'))
						break
					case 'aurora':
						imageCld = imageCld.effect(artisticFilter('aurora'))
						break
					case 'daguerre':
						imageCld = imageCld.effect(artisticFilter('daguerre'))
						break
					case 'eucalyptus':
						imageCld = imageCld.effect(artisticFilter('eucalyptus'))
						break
					case 'fes':
						imageCld = imageCld.effect(artisticFilter('fes'))
						break
					case 'frost':
						imageCld = imageCld.effect(artisticFilter('frost'))
						break
					case 'hairspray':
						imageCld = imageCld.effect(artisticFilter('hairspray'))
						break
					case 'hokusai':
						imageCld = imageCld.effect(artisticFilter('hokusai'))
						break
					case 'incognito':
						imageCld = imageCld.effect(artisticFilter('incognito'))
						break
					case 'linen':
						imageCld = imageCld.effect(artisticFilter('linen'))
						break
					case 'peacock':
						imageCld = imageCld.effect(artisticFilter('peacock'))
						break
					case 'primavera':
						imageCld = imageCld.effect(artisticFilter('primavera'))
						break
					case 'quartz':
						imageCld = imageCld.effect(artisticFilter('quartz'))
						break
					case 'red_rock':
						imageCld = imageCld.effect(artisticFilter('red_rock'))
						break
					case 'refresh':
						imageCld = imageCld.effect(artisticFilter('refresh'))
						break
					case 'sizzle':
						imageCld = imageCld.effect(artisticFilter('sizzle'))
						break
					case 'sonnet':
						imageCld = imageCld.effect(artisticFilter('sonnet'))
						break
					case 'ukulele':
						imageCld = imageCld.effect(artisticFilter('ukulele'))
						break
					case 'zorro':
						imageCld = imageCld.effect(artisticFilter('zorro'))
						break
					case 'cartoonify':
						imageCld = imageCld.effect(cartoonify())
						break
					case 'oil_painting':
						imageCld = imageCld.effect(oilPaint())
						break
					case 'pixelate':
						imageCld = imageCld.effect(pixelate())
						break
					case 'sharpen':
						imageCld = imageCld.effect(sharpen())
						break
					case 'negate':
						imageCld = imageCld.effect(negate())
						break
					case 'colorize':
						imageCld = imageCld.effect(colorize())
						break
					case 'improve':
						imageCld = imageCld.adjust(improve())
						break
				}
			}

			// Generate the transformed URL
			const url = imageCld.toURL()
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
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="h-[100dvh] max-w-full overflow-y-auto p-4 md:p-6">
				<DialogTitle className="text-center text-2xl font-semibold">Image Editor</DialogTitle>
				<DialogDescription className="text-center">Enhance and transform your images</DialogDescription>

				<div className="flex flex-col gap-6 md:flex-row md:gap-8">
					{/* Editor Section */}
					<div className="w-full md:w-1/3">
						<div className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="brightness">Brightness</Label>
								<Slider
									id="brightness"
									defaultValue={[brightness]}
									min={-99}
									max={100}
									step={1}
									onValueChange={handleSliderChange(setBrightness)}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="contrast">Contrast</Label>
								<Slider
									id="contrast"
									defaultValue={[contrast]}
									min={1}
									max={200}
									step={1}
									onValueChange={handleSliderChange(setContrast)}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="saturation">Saturation</Label>
								<Slider
									id="saturation"
									defaultValue={[saturation]}
									min={0}
									max={200}
									step={1}
									onValueChange={handleSliderChange(setSaturation)}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="blur">Blur</Label>
								<Slider
									id="blur"
									defaultValue={[blur]}
									min={0}
									max={2000}
									step={100}
									onValueChange={handleSliderChange(setBlur)}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="effect">Effect</Label>
								<Select onValueChange={handleEffectChange}>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select an effect" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="None">None</SelectItem>
										<SelectItem value="improve">Auto Improve</SelectItem>
										<SelectItem value="sepia">Sepia</SelectItem>
										<SelectItem value="grayscale">Grayscale</SelectItem>
										<SelectItem value="blackwhite">Black & White</SelectItem>
										<SelectItem value="vignette">Vignette</SelectItem>
										<SelectItem value="vintage">Vintage</SelectItem>
										<SelectItem value="art">Art</SelectItem>
										<SelectItem value="cartoonify">Cartoonify</SelectItem>
										<SelectItem value="oil_painting">Oil Painting</SelectItem>
										<SelectItem value="pixelate">Pixelate</SelectItem>
										<SelectItem value="sharpen">Sharpen</SelectItem>
										<SelectItem value="negate">Negate</SelectItem>
										<SelectItem value="colorize">Colorize</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<LoaderButton onClick={handleTransformation} isLoading={loading} className="w-full">
								Transform
							</LoaderButton>
						</div>
					</div>

					{/* Image Preview Section */}
					<div className="relative flex-1">
						<ReactCompareSlider
							itemOne={
								<ReactCompareSliderImage
									src={currentImage!}
									alt="Original"
									className="object-contain"
								/>
							}
							itemTwo={
								<ReactCompareSliderImage
									src={imagePreview || currentImage!}
									alt="Transformed"
									className="object-contain"
								/>
							}
							className="mx-auto h-auto w-full max-w-3xl max-h-[600px] rounded-2xl"
						/>
						{loading && (
							<div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl">
								<Loader2 className="h-10 w-10 animate-spin text-white" />
							</div>
						)}
					</div>
				</div>

				<div className="mt-4 flex justify-end">
					<Button onClick={onClose} variant="outline">
						Close
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}
