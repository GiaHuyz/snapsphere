import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function getPublicId(url: string): string {
	return url.split('/').slice(-2).join('/').split('.')[0]
}

export function checkPinDetailsPage(pathname: string): boolean {
    return /^\/pin\/[^\/]+\/?$/.test(pathname)
}

export function checkUserPage(pathname: string): boolean {
    return /^\/user\/[^\/]+\/?$/.test(pathname)
}

export function checkBoardDetailsPage(pathname: string): boolean {
    return /^\/user\/[^\/]+\/[^\/]+\/?$/.test(pathname)
}

