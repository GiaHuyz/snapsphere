import { Pin } from '@/actions/pin-actions'
import { createStore } from 'zustand'

export type PinProps = {
	pins: Pin[]
}

type PinStore = PinProps & {
	setPins: (pins: Pin[]) => void
}

export const createPinStore = (initProps?: Partial<PinProps>) => {
	const DEFAULT_PROPS: PinProps = {
		pins: []
	}
	return createStore<PinStore>()((set) => ({
		...DEFAULT_PROPS,
		...initProps,
		setPins: (pins: Pin[]) => set({ pins })
	}))
}
