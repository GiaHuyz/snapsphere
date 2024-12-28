'use client'

import { followUserAction, unfollowUserAction } from '@/actions/follow-actions'
import { LoaderButton } from '@/components/loading-button'
import { isActionError, ServerActionResponse } from '@/lib/errors'
import { useClerk, useUser } from '@clerk/nextjs'
import { useState } from 'react'
import { toast } from 'sonner'

interface FollowButtonProps {
	isFollowing: boolean
	followingId: string
}

export default function FollowButton({ isFollowing, followingId }: FollowButtonProps) {
	const clerk = useClerk()
	const [following, setFollowing] = useState(isFollowing)
	const [loading, setLoading] = useState(false)
	const { user } = useUser()

	const handleFollow = async () => {
		if (!user) {
			return clerk.openSignIn()
		}

		setLoading(true)
		let res: ServerActionResponse<void> | null = null
		if (following) {
			res = await unfollowUserAction({ followingId })
		} else {
			res = await followUserAction({ followingId })
		}
		if (isActionError(res)) {
			toast.error(res.error)
		} else {
			toast.success(`${following ? 'Unfollowed' : 'Followed'} successfully`)
			setFollowing(!following)
		}

		setLoading(false)
	}

	return (
		<LoaderButton
			variant="outline"
			className={`rounded-full ${following ? 'bg-black text-white' : ''}`}
			onClick={handleFollow}
			isLoading={loading}
		>
			{following ? 'Unfollow' : 'Follow'}
		</LoaderButton>
	)
}
