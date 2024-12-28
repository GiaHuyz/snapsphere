'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useFollowModal } from '@/hooks/use-follow-modal'
import { User } from '@clerk/nextjs/server'
import { Share } from 'lucide-react'

interface UserStatsProps {
	user: User
	followers: number
	following: number
}

export default function UserStats({ user, followers, following }: UserStatsProps) {
	const { onOpen } = useFollowModal()

	return (
		<div className="flex flex-col items-center space-y-3 py-3">
			<Avatar className="h-28 w-28">
				<AvatarImage src={user.imageUrl} alt={user.username || "Avatar"} />
				<AvatarFallback>{user.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
			</Avatar>
			<h1 className="text-2xl font-bold">{user.firstName + ' ' + user.lastName}</h1>
			<p className="text-muted-foreground">
				<span>plus.google.com/102566985836725009655</span>{' '}
			</p>
			{(user.unsafeMetadata?.bio as string) && (
				<p className="text-muted-foreground">{user.unsafeMetadata?.bio as string}</p>
			)}
			<div className="flex items-center gap-2 text-sm text-muted-foreground">
				<span>@{user.username}</span>
				<Button variant="link" className="p-0 h-auto" onClick={() => onOpen('followers', user.id)}>
					<span className="font-semibold text-foreground">{followers}</span> followers
				</Button>
				<span>·</span>
				<Button variant="link" className="p-0 h-auto" onClick={() => onOpen('following', user.id)}>
					<span className="font-semibold text-foreground">{following}</span> following
				</Button>
			</div>
			<div className="flex gap-2">
				<Button variant="secondary" className="rounded-full">
					<Share className="mr-2 h-4 w-4" />
					Share
				</Button>
				<Button variant="secondary" className="rounded-full">
					Edit profile
				</Button>
			</div>
		</div>
	)
}
