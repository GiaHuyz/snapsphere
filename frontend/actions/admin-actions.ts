'use server'

import { isAdmin } from '@/lib/check-admin'
import { getErrorMessage } from '@/lib/errors'
import { clerkClient } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

const client = await clerkClient()

export async function getUsers(page: number = 1, query: string = '', limit: number = 10) {
	try {
		const users = await client.users.getUserList({
			query,
			limit,
			offset: (page - 1) * limit,
			orderBy: '-created_at'
		})

		return {
			users: JSON.parse(JSON.stringify(users.data)),
			totalPages: Math.ceil(users.totalCount / limit),
			currentPage: page
		}
	} catch (error) {
		return { error: getErrorMessage(error) }
	}
}

export async function updateUserStatus(userId: string, action: 'ban' | 'unban') {
	try {
		if (!(await isAdmin())) {
			throw new Error('Unauthorized')
		}

		if(action === 'ban') {
			await client.users.banUser(userId)
		} else if(action === 'unban') {
			await client.users.unbanUser(userId)
		}

		revalidatePath('/admin/users')
		return { success: true }
	} catch (error) {
		return { error: getErrorMessage(error) }
	}
}

export async function deleteUser(userId: string) {
	try {
		if (!(await isAdmin())) {
			throw new Error('Unauthorized')
		}

		await client.users.deleteUser(userId)
		revalidatePath('/admin/users')

		return { success: true }
	} catch (error) {
		return { error: getErrorMessage(error) }
	}
}
