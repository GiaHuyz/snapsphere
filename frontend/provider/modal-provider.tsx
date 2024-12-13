import { CreateBoardModal } from '@/components/modals/create-board-modal'
import { EditBoardModal } from '@/components/modals/edit-board-modal'
import { EditPinModal } from '@/components/modals/edit-pin-modal'

export function ModalProvider() {
	return (
		<>
			<CreateBoardModal />
            <EditBoardModal />
            <EditPinModal />
		</>
	)
}
