'use client'

import { BoardDropdownProps, createBoardDropdownStore } from '@/stores/board-dropdown-store'
import { createContext, useContext, useRef } from 'react'
import { useStore } from 'zustand'

type BoardDropdownStoreApi = ReturnType<typeof createBoardDropdownStore>
type BoardDropdownProviderProps = React.PropsWithChildren<BoardDropdownProps>

const BoardDropdownStoreContext = createContext<BoardDropdownStoreApi | null>(null)

export const BoardDropdownProvider = ({ children, ...props }: BoardDropdownProviderProps) => {
	const storeRef = useRef<BoardDropdownStoreApi>()

	if (!storeRef.current) {
		storeRef.current = createBoardDropdownStore(props)
	}

	return <BoardDropdownStoreContext.Provider value={storeRef.current}>{children}</BoardDropdownStoreContext.Provider>
}

export const useBoardDropdownStore = () => {
	const boardDropdownStoreContext = useContext(BoardDropdownStoreContext)
	if (!boardDropdownStoreContext) {
		throw new Error('useBoardDropdownStore must be used within a BoardDropdownProvider')
	}
	return useStore(boardDropdownStoreContext, (state) => state)
}
