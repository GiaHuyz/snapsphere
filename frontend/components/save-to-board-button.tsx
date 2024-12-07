'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useClerk } from '@clerk/nextjs'

interface SaveButtonProps {
	className?: string
	variant?: 'default' | 'overlay'
	onClick?: () => void
	isLoggedIn?: boolean
}

export function SaveButton({ className, variant = 'default', onClick, isLoggedIn }: SaveButtonProps) {
	const clerk = useClerk()

	const handleClick = (e: React.MouseEvent) => {
		e.preventDefault()
		if (!isLoggedIn) {
			clerk.openSignIn()
		}
		if (onClick) {
			onClick()
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
