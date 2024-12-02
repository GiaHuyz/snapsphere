import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SaveButtonProps {
	className?: string
	variant?: 'default' | 'overlay'
    onClick?: () => void
}

export function SaveButton({ className, variant = 'default', onClick }: SaveButtonProps) {
	return (
		<Button
			className={cn(
				'rounded-full',
				variant === 'default' && 'bg-red-500 text-white hover:bg-red-600',
				variant === 'overlay' && 'h-8 bg-red-500 px-4 text-white hover:bg-red-600',
				className
			)}
			onClick={onClick}
		>
			Save
		</Button>
	)
}
