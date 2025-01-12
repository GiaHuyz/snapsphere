'use client'

import { Pin } from '@/actions/pin-actions'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useEditPinModal } from '@/hooks/use-edit-pin-modal'
import { useReportModal } from '@/hooks/use-report-modal'
import { ReportType } from '@/lib/constants'
import { checkPinDetailsPage } from '@/lib/utils'
import { useUser } from '@clerk/nextjs'
import { Download, Flag, Pencil } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function PinActions({ pin, children }: { pin: Pin; children: React.ReactNode }) {
	const { onOpen } = useReportModal()
	const { onOpen: onEditOpen } = useEditPinModal()
	const { user } = useUser()
	const pathname = usePathname()

	const handleDownload = async () => {
		try {
			const response = await fetch(pin.url)
			const blob = await response.blob()

			const link = document.createElement('a')
			link.href = window.URL.createObjectURL(blob)

			const filename = pin.url.split('/').pop() || 'image'
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
				{checkPinDetailsPage(pathname) && user?.id === pin.user_id && (
					<DropdownMenuItem className="cursor-pointer" onClick={() => onEditOpen(pin)}>
						<Pencil className="mr-2 h-4 w-4" />
						Edit
					</DropdownMenuItem>
				)}
				<DropdownMenuItem onClick={handleDownload} className="cursor-pointer">
					<Download className="mr-2 h-4 w-4" />
					Download image
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				{user?.id !== pin.user_id && (
					<DropdownMenuItem
						onClick={() => onOpen(pin._id, ReportType.PIN)}
						className="text-red-600 cursor-pointer"
					>
						<Flag className="mr-2 h-4 w-4" />
						Report Pin
					</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
