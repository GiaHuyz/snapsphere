'use client'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useReportModal } from '@/hooks/use-report-modal'
import { Download, Eye, Flag } from 'lucide-react'

export default function PinActions({
	pinId,
	pinUrl,
	children
}: {
	pinId: string
	pinUrl: string
	children: React.ReactNode
}) {
	const { onOpen } = useReportModal()

	const handleDownload = async () => {
		try {
			const response = await fetch(pinUrl)
			const blob = await response.blob()

			const link = document.createElement('a')
			link.href = window.URL.createObjectURL(blob)

			const filename = pinUrl.split('/').pop() || 'image'
			link.download = filename

			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
			window.URL.revokeObjectURL(link.href)
		} catch (error) {
			console.error('Error downloading image:', error)
		}
	}

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
			<DropdownMenuContent align="end" onClick={(e) => e.preventDefault()}>
				<DropdownMenuItem className="cursor-pointer">
					<Eye className="mr-2 h-4 w-4" />
					Hide Pin
				</DropdownMenuItem>
				<DropdownMenuItem onClick={handleDownload} className="cursor-pointer">
					<Download className="mr-2 h-4 w-4" />
					Download image
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => onOpen(pinId, 'pin')} className="text-red-600 cursor-pointer">
					<Flag className="mr-2 h-4 w-4" />
					Report Pin
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
