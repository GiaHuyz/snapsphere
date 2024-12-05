'use client'

import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { BoardDropdown } from './board-dropdown'

interface Board {
	id: string
	name: string
	image?: string
}

interface BoardSelectProps {
	value?: Board
	onChange: (board: Board) => void
	className?: string
}

export function BoardSelect({ value, onChange, className }: BoardSelectProps) {
	return (
		<BoardDropdown mode="select" onChange={onChange}>
			<Button
				variant="outline"
				role="combobox"
				className={`w-full justify-between rounded-xl border-2 ${className}`}
			>
				<div className="flex items-center gap-2">
					{value ? (
						<>
							{value.image && (
								<div className="h-6 w-6 overflow-hidden rounded-md">
									<Image
										src={value.image}
										alt={value.name}
										width={24}
										height={24}
										className="h-full w-full object-cover"
									/>
								</div>
							)}
							<span>{value.name}</span>
						</>
					) : (
						'Choose a board'
					)}
				</div>
				<ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
			</Button>
		</BoardDropdown>
	)
}
