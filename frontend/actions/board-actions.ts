'use server'

import { auth } from '@clerk/nextjs/server'

export interface Board {
	id: string
	title: string
	pinCount: number
	sectionCount: number
	createAt: string
	coverImages: string[]
}

export interface CreateBoard {
	title: string
	secret: boolean
	image?: string
}

export async function createBoard(data: CreateBoard) {
	const { userId } = await auth()

	if (!userId) {
		throw new Error('Unauthorized')
	}

	try {
		const response = await fetch('http://localhost:8000/boards', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				...data,
				pinCount: 0,
				sectionCount: 0,
				coverImages: [],
				createAt: new Date().toISOString()
			})
		})

		if (response.ok) {
			// revalidateTag('boards')
			return { success: true, newBoard: await response.json() }
		} else {
			return { success: false, error: 'Failed to create board' }
		}
	} catch (error) {
		console.error('Error creating board:', error)
		return { success: false, error: 'Failed to create board' }
	}
}

export async function getBoards(): Promise<Board[]> {
	const { userId } = await auth()

	if (!userId) {
		return []
	}

	try {
		const response = await fetch('http://localhost:8000/boards', {
            method: 'GET',
            cache: 'force-cache',
			headers: {
				'Content-Type': 'application/json'
			},
			next: {
				tags: ['boards']
			}
		})
		const boards = await response.json()
        console.log('ok')
		return boards
	} catch (error) {
		console.error('Error fetching boards:', error)
		throw new Error('Failed to fetch boards')
	}
}
