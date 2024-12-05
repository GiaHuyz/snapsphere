'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useCreateBoardModal } from '@/hooks/use-create-board-modal'
import Image from 'next/image'

export function CreateBoardModal() {
	const { isOpen, onClose, image } = useCreateBoardModal()

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className={`w-11/12 rounded-2xl sm:${image ? 'max-w-[720px]' : 'max-w-[480px]'} sm:rounded-2xl`}>
				<DialogHeader>
					<DialogTitle className="text-center text-2xl">Create Board</DialogTitle>
				</DialogHeader>
				<div className={`grid gap-4 py-4 ${image && 'grid-cols-[240px,1fr]'}`}>
					{image && (
						<div>
							<Image
								src={image}
								alt="wuxia"
								width={200}
								height={150}
								className="w-full object-cover rounded-2xl"
							/>
						</div>
					)}
					<div className={image ? 'grid-cols-1' : ''}>
						<div className="mb-4">
							<Label htmlFor="name" className="text-right">
								Name
							</Label>
							<Input id="name" placeholder="Enter board name" className="h-12 rounded-2xl" />
						</div>
						<div className="flex items-center gap-2">
							<Label>Secret</Label>
							<Switch />
						</div>
					</div>
				</div>
				<DialogFooter>
					<Button type="submit">Create</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
