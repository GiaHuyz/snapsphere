'use client'

import { createPinStore, PinProps } from '@/stores/pins-store'
import { createContext, useContext, useRef } from 'react'
import { useStore } from 'zustand'

type PinStoreApi = ReturnType<typeof createPinStore>
type PinProviderProps = React.PropsWithChildren<PinProps>

const PinStoreContext = createContext<PinStoreApi | null>(null)

export const PinProvider = ({ children, ...props }: PinProviderProps) => {
	const storeRef = useRef<PinStoreApi>()

	if (!storeRef.current) {
		storeRef.current = createPinStore(props)
	}

	return <PinStoreContext.Provider value={storeRef.current}>{children}</PinStoreContext.Provider>
}

export const usePinStore = () => {
	const pinStoreContext = useContext(PinStoreContext)
	if (!pinStoreContext) {
		throw new Error('usePinStore must be used within a PinProvider')
	}
	return useStore(pinStoreContext, (state) => state)
}
