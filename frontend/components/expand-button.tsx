'use client'

import { Button } from '@/components/ui/button'
import { useFullScreenModal } from '@/hooks/use-full-screen-modal'
import { Expand } from 'lucide-react'

export default function ExpandButton({ imageUrl }: { imageUrl: string }) {
	const { onOpen } = useFullScreenModal()

	return (
		<Button
			size="icon"
			variant="secondary"
			className="absolute bottom-4 right-4 rounded-full backdrop-blur-sm"
			onClick={() => onOpen(imageUrl)}
		>
			<Expand className="h-5 w-5" />
		</Button>
	)
}
