import { Board } from "@/actions/board-actions"
import { create } from "zustand"

interface BoardDropdownStore {
    boards: Board[]
    setBoards: (boards: Board[]) => void
}

export const useBoardDropdownStore = create<BoardDropdownStore>()((set) => ({
    boards: [],
    setBoards: (boards: Board[]) => set({ boards })
}))