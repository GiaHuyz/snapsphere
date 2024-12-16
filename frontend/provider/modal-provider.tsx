import CreateBoardModal from '@/components/modals/create-board-modal'
import UploadImageModal from '@/components/modals/upload-image-modal'

export default function ModalProvider() {
	return (
		<>
			<CreateBoardModal />
            <UploadImageModal />
		</>
	)
}
