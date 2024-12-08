'use client'

import { BoardProps, createBoardStore } from '@/stores/board-store'
import { createContext, useContext, useRef } from 'react'
import { useStore } from 'zustand'

type BoardStoreApi = ReturnType<typeof createBoardStore>
type BoardProviderProps = React.PropsWithChildren<BoardProps>

const BoardStoreContext = createContext<BoardStoreApi | null>(null)

export const BoardProvider = ({ children, ...props }: BoardProviderProps) => {
	const storeRef = useRef<BoardStoreApi>()

	if (!storeRef.current) {
		storeRef.current = createBoardStore(props)
	}

	return <BoardStoreContext.Provider value={storeRef.current}>{children}</BoardStoreContext.Provider>
}

export const useBoardStore = () => {
	const boardStoreContext = useContext(BoardStoreContext)
	if (!boardStoreContext) {
		throw new Error('useBoardStore must be used within a BoardProvider')
	}
	return useStore(boardStoreContext, (state) => state)
}
