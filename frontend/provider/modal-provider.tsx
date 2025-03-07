import CreateBoardModal from '@/components/modals/create-board-modal'
import EditBoardModal from '@/components/modals/edit-board-modal'
import EditPinModal from '@/components/modals/edit-pin-modal'
import LikesListModal from '@/components/modals/like-list-modal'
import { MergeBoardModal } from '@/components/modals/merge-board-modal'
import PinTransModal from '@/components/modals/pin-trans-modal'
import ReportModal from '@/components/modals/report-modal'
import { SaveFromUrlModal } from '@/components/modals/save-from-url-modal'
import UploadImageModal from '@/components/modals/upload-image-modal'

export default function ModalProvider() {
	return (
		<>
			<CreateBoardModal />
			<EditBoardModal />
            <EditPinModal />
			<UploadImageModal />
			<PinTransModal />
            <ReportModal />
            <LikesListModal />
            <SaveFromUrlModal />
            <MergeBoardModal />
		</>
	)
}
