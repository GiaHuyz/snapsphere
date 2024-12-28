'use server'

import { isAdmin } from '@/lib/check-admin'
import { clerkClient } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

const client = await clerkClient()

export async function getUsers(page: number = 1, query: string = '', limit: number = 10) {
	try {
		if (!(await isAdmin())) {
			throw new Error('Unauthorized')
		}

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
		console.error('Error fetching users:', error)
		throw new Error('Failed to fetch users')
	}
}

export async function updateUserStatus(userId: string, action: 'suspend' | 'unsuspend') {
	try {
		if (!(await isAdmin())) {
			throw new Error('Unauthorized')
		}

		await client.users.updateUser(userId, {
			publicMetadata: { suspended: action === 'suspend' }
		})

		revalidatePath('/admin/users')
		return { success: true }
	} catch (error) {
		console.error('Error updating user:', error)
		throw new Error('Failed to update user')
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
		console.error('Error deleting user:', error)
		throw new Error('Failed to delete user')
	}
}
