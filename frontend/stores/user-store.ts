import { User } from '@clerk/nextjs/server'
import { createStore } from 'zustand'

export type UserProps = {
	user: User | null
    isSignedIn: boolean
}

type UserStore = UserProps & {
	setUser: (user: User) => void
}

export const createUserStore = (initProps?: Partial<UserProps>) => {
	const DEFAULT_PROPS: UserProps = {
		user: null,
        isSignedIn: false
	}
	return createStore<UserStore>()((set) => ({
		...DEFAULT_PROPS,
		...initProps,
		setUser: (user: User) => set({ user, isSignedIn: true }),
	}))
}
