import { Button, ButtonProps } from '@/components/ui/button'
import { Loader2, LucideIcon } from 'lucide-react'
import { forwardRef, ReactNode } from 'react'

type LoaderButtonProps = ButtonProps & {
	isLoading: boolean
    disabled?: boolean
	icon?: LucideIcon
	children: ReactNode
}

export const LoaderButton = forwardRef<HTMLButtonElement, LoaderButtonProps>(
	({ isLoading, disabled, icon: Icon, children, ...props }, ref) => {
		if (isLoading) {
			return (
				<Button ref={ref} disabled={isLoading} {...props}>
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					{children}
				</Button>
			)
		}

		return (
			<Button ref={ref} disabled={isLoading || disabled} {...props}>
				{Icon ? (
					<>
						<Icon size={18} className="mr-3" />
						{children}
					</>
				) : (
					children
				)}
			</Button>
		)
	}
)

LoaderButton.displayName = 'LoaderButton'
