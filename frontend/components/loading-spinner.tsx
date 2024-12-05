import { cn } from '@/lib/utils'
import Image from 'next/image'

export function Spinner({ className }: { className?: string }) {
	return <Image className={cn('animate-spin', className)} src="/loading.svg" width={20} height={20} alt="Loading icon" />
}
