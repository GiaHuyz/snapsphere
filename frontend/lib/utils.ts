import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function getPublicId(url: string): string {
	return url.split('/').slice(-2).join('/').split('.')[0]
}
