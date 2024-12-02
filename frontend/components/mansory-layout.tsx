import { cn } from '@/lib/utils'

export function MansoryLayout({ children, className }: { children: React.ReactNode; className?: string }) {
	return (
        <div className={cn('px-2 columns-1 md:columns-2 lg:columns-4', className)}>
            {children}
        </div>
    )
}
