import { BoardPage, getBoardsAction } from '@/actions/board-actions'
import { BoardsTable } from '@/components/pages/admin/board-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function AdminBoardsPage() {
    const boards = await getBoardsAction({}) as BoardPage

    return (
        <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Boards Management</h2>
            <Card>
                <CardHeader>
                    <CardTitle>Boards</CardTitle>
                </CardHeader>
                <CardContent>
                    <BoardsTable initialBoards={boards} />
                </CardContent>
            </Card>
        </div>
    )
}
