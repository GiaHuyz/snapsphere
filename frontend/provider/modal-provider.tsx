import CreateBoardModal from '@/components/modals/create-board-modal'
import EditBoardModal from '@/components/modals/edit-board-modal'
import PinTransModal from '@/components/modals/pin-trans-modal'
import UploadImageModal from '@/components/modals/upload-image-modal'

export default function ModalProvider() {
	return (
		<>
			<CreateBoardModal />
			<EditBoardModal />
			<UploadImageModal />
			<PinTransModal />
		</>
	)
}
