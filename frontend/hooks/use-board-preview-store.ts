import { Board } from "@/actions/board-actions"
import { create } from "zustand"

interface BoardPreviewStore {
    boardsPreview: Board[]
    setBoardsPreview: (boardsPreview: Board[]) => void
}

export const useBoardPreviewStore = create<BoardPreviewStore>()((set) => ({
    boardsPreview: [],
    setBoardsPreview: (boardsPreview: Board[]) => set({ boardsPreview })
}))