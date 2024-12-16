'use client'

import { BoardPreviewProps, createBoardPreviewStore } from '@/stores/board-preview-store'
import { createContext, useContext, useRef } from 'react'
import { useStore } from 'zustand'

type BoardPreviewStoreApi = ReturnType<typeof createBoardPreviewStore>
type BoardPreviewProviderProps = React.PropsWithChildren<BoardPreviewProps>

const BoardPreviewStoreContext = createContext<BoardPreviewStoreApi | null>(null)

export const BoardPreviewProvider = ({ children, ...props }: BoardPreviewProviderProps) => {
	const storeRef = useRef<BoardPreviewStoreApi>()

	if (!storeRef.current) {
		storeRef.current = createBoardPreviewStore(props)
	}

	return <BoardPreviewStoreContext.Provider value={storeRef.current}>{children}</BoardPreviewStoreContext.Provider>
}

export const useBoardPreviewStore = () => {
	const boardPreviewStoreContext = useContext(BoardPreviewStoreContext)
	if (!boardPreviewStoreContext) {
		throw new Error('useBoardPreviewStore must be used within a BoardPreviewProvider')
	}
	return useStore(boardPreviewStoreContext, (state) => state)
}
