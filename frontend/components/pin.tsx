'use client'

import { Board } from '@/actions/board-actions'
import { Pin as PinType } from '@/actions/pin-actions'
import BoardDropdown from '@/components/board-dropdown'
import PinActions from '@/components/pin-actions'
import { SaveButton } from '@/components/save-to-board-button'
import { Button } from '@/components/ui/button'
import { useEditPinModal } from '@/hooks/use-edit-pin-modal'
import { useUser } from '@clerk/nextjs'
import { MoreHorizontal, Pencil } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface PinProps {
	pin: PinType
	boardsDropdown: Board[]
}

export default function Pin({ pin, boardsDropdown }: PinProps) {
	const { isSignedIn } = useUser()
	const { onOpen } = useEditPinModal()
	const pathname = usePathname()
	const { user } = useUser()

	const handleEdit = (e: React.MouseEvent) => {
		e.preventDefault()
		onOpen(pin)
	}

	return (
		<div className="group relative mb-4 w-full overflow-hidden rounded-xl cursor-pointer">
			{/* Main Image */}

			<Image
				src={pin.url}
				alt={pin.title || 'Pin Image'}
				width={300}
				height={300}
				className="object-fill w-full max-h-[508px]"
                priority
			/>

			<Link href={`/pin/${pin._id}`}>
				{/* Overlay Actions */}
				<div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
					{/* Top Actions */}
					<div
						className={`absolute left-4 right-4 top-4 flex items-center ${
							isSignedIn ? 'justify-between' : 'justify-end'
						}`}
					>
						{isSignedIn && <BoardDropdown boardsDropdown={boardsDropdown} mode="save" pin={pin} />}
						<SaveButton
							variant="overlay"
							isLoggedIn={isSignedIn}
							pinId={pin._id}
							pinUrl={pin.url}
							boardId={boardsDropdown[0]?._id}
						/>
					</div>

					{/* Bottom Actions */}
					<div className="absolute bottom-4 right-4 flex items-center gap-2">
						{pathname !== '/' && pin.user_id === user?.id && (
							<Button
								size="icon"
								variant="secondary"
								className="h-8 w-8 rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60"
								onClick={handleEdit}
								data-prevent-nprogress={true}
							>
								<Pencil className="h-4 w-4" />
							</Button>
						)}
						<PinActions pinId={pin._id} pinUrl={pin.url}>
							<Button
								size="icon"
								variant="secondary"
								className="h-8 w-8 rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60"
								data-prevent-nprogress={true}
								onClick={(e) => e.preventDefault()}
							>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</PinActions>
					</div>
				</div>
			</Link>
		</div>
	)
}
