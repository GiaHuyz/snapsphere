'use client'

import { savePinToBoardAction } from '@/actions/pin-actions'
import { Button } from '@/components/ui/button'
import { isActionError } from '@/lib/errors'
import { cn } from '@/lib/utils'
import { useClerk } from '@clerk/nextjs'
import { toast } from 'sonner'

interface SaveButtonProps {
	className?: string
	pinId: string
	boardId: string
	variant?: 'default' | 'overlay'
	isLoggedIn?: boolean
}

export function SaveButton({ className, variant = 'default', isLoggedIn, pinId, boardId }: SaveButtonProps) {
	const clerk = useClerk()

	const handleClick = async (e: React.MouseEvent) => {
		e.preventDefault()
		if (!isLoggedIn) {
			return clerk.openSignIn()
		}

		const res = await savePinToBoardAction({ pinId, boardId })
		if (isActionError(res)) {
			toast.error(res.error)
		} else {
			toast.success('Pin saved successfully')
		}
	}

	return (
		<Button
			className={cn(
				'rounded-full',
				variant === 'default' && 'bg-red-500 text-white hover:bg-red-600',
				variant === 'overlay' && 'h-8 bg-red-500 px-4 text-white hover:bg-red-600',
				className
			)}
			onClick={handleClick}
		>
			Save
		</Button>
	)
}
