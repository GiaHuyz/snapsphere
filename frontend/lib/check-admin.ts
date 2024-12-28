import getCurrentUser from "@/lib/get-current-user"

export const isAdmin = async () => {
    const user = await getCurrentUser()
    return user?.publicMetadata.role === 'admin'
}