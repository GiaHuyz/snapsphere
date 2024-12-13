'use client'

import { createUserStore, UserProps } from '@/stores/user-store'
import { createContext, useContext, useRef } from 'react'
import { useStore } from 'zustand'

type UserStoreApi = ReturnType<typeof createUserStore>
type UserProviderProps = React.PropsWithChildren<UserProps>

const UserStoreContext = createContext<UserStoreApi | null>(null)

export const UserProvider = ({ children, ...props }: UserProviderProps) => {
	const storeRef = useRef<UserStoreApi>()

	if (!storeRef.current) {
		storeRef.current = createUserStore(props)
	}

	return <UserStoreContext.Provider value={storeRef.current}>{children}</UserStoreContext.Provider>
}

export const useUserStore = () => {
	const userStoreContext = useContext(UserStoreContext)
	if (!userStoreContext) {
		throw new Error('useUserStore must be used within a UserProvider')
	}
	return useStore(userStoreContext, (state) => state)
}
