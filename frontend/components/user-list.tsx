import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { User } from "@clerk/nextjs/server"
import Link from "next/link"

interface UserListProps {
  users: User[]
}

export default function UserList({ users }: UserListProps) {
  if (users.length === 0) {
    return (
      <div className="text-center mt-8">
        <p className="text-muted-foreground">No users found</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {users.map((user) => (
        <Link href={`/user/${user.username}`} key={user.id} className="flex items-center justify-between p-4 bg-card rounded-2xl hover:bg-gray-100 dark:hover:bg-darkbg">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.imageUrl} alt={user.username || ""} />
              <AvatarFallback>
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <span className="font-medium">{user.firstName} {user.lastName}</span>
              <span className="text-sm text-muted-foreground">@{user.username}</span>
              <span className="text-sm text-muted-foreground">{user.unsafeMetadata.followersCount as number || 0} followers</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

