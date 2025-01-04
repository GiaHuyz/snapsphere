'use client'

import { deletePinAction, getAllPinsUserAction, PinPage } from '@/actions/pin-actions'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Pagination } from '@/components/ui/pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { isActionError } from '@/lib/errors'
import { formatTime } from '@/lib/format-time'
import { MoreHorizontal } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export function PinsTable({ initialPins }: { initialPins: PinPage }) {
	const [data, setData] = useState(initialPins.data)
	const [currentPage, setCurrentPage] = useState(1)
	const [totalPages, setTotalPages] = useState(initialPins.totalPages)

	const fetchPins = async (page: number) => {
		const res = await getAllPinsUserAction({ page })
		if (!isActionError(res)) {
			setData(res.data)
			setCurrentPage(page)
			setTotalPages(res.totalPages)
		}
	}

	const router = useRouter()
	const deletePin = async (pinId: string) => {
		const res = await deletePinAction(pinId)
		if (isActionError(res)) {
			return toast.error(res.error)
		}
		router.refresh()
	}

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="text-center">Pin</TableHead>
						<TableHead className="text-center">User</TableHead>
						<TableHead className="text-center">Reference Link</TableHead>
						<TableHead className="text-center">Allow Comment</TableHead>
						<TableHead className="text-center">Comment Count</TableHead>
						<TableHead className="text-center">Save Count</TableHead>
						<TableHead className="text-center">Secret</TableHead>
						<TableHead className="text-center">Created At</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map((pin) => (
						<TableRow key={pin._id}>
							<TableCell className="font-medium">
								<Link href={`/pin/${pin._id}`}>
									<div className="flex items-center gap-3">
										<div className="overflow-hidden rounded-md">
											<Image
												src={pin.url}
												alt={pin.title || 'Pin Image'}
												width={0}
												height={0}
												sizes="100vw"
												className="w-[150px] h-auto"
												priority
											/>
										</div>
										<div className="flex-1 space-y-1">
											<p className="text-lg">{pin.title}</p>
											<p>{pin.description}</p>
										</div>
									</div>
								</Link>
							</TableCell>
							<TableCell className="text-center">{pin.user_id}</TableCell>
							<TableCell className="text-center">{pin.referenceLink}</TableCell>
							<TableCell className="text-center">{pin.isAllowedComment ? 'Yes' : 'No'}</TableCell>
							<TableCell className="text-center">{pin.commentCount}</TableCell>
							<TableCell className="text-center">{pin.saveCount}</TableCell>
							<TableCell className="text-center">{pin.secret ? 'Yes' : 'No'}</TableCell>
							<TableCell className="text-center">{formatTime(pin.createdAt)}</TableCell>
							<TableCell className="text-right">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" className="h-8 w-8 p-0">
											<span className="sr-only">Open menu</span>
											<MoreHorizontal className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem
											className="text-red-600 cursor-pointer"
											onClick={() => deletePin(pin._id)}
										>
											Delete Pin
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<Pagination className='pb-4' currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => fetchPins(page)} />
		</div>
	)
}
