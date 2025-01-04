import { Pin } from "@/actions/pin-actions"
import { create } from "zustand"

interface IPinStore {
    pins: Pin[]
    setPins: (pins: Pin[]) => void
}

export const usePinStore = create<IPinStore>((set) => ({
    pins: [],
    setPins: (pins: Pin[]) => set({ pins }),
}))

