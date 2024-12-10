import { CreateBoardModal } from '@/components/modals/create-board-modal'
import { EditBoardModal } from '@/components/modals/edit-board-modal'

export function ModalProvider() {
	return (
		<>
			<CreateBoardModal />
            <EditBoardModal />
		</>
	)
}
