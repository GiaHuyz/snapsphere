'use server'

import { clerkClient } from "@clerk/nextjs/server"

export const getUserAction = async (userId: string) => {
    const user = await (await clerkClient()).users.getUser(userId)
    return JSON.stringify(user)
} 