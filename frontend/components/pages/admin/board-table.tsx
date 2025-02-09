'use client'

import { Board, deleteBoardAction, getBoardsAction } from '@/actions/board-actions'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Pagination } from '@/components/ui/pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { isActionError } from '@/lib/errors'
import { formatTime } from '@/lib/format-time'
import { MoreHorizontal, Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

interface BoardsTableProps {
	initialBoards: {
		data: Board[]
		totalPages: number
	}
}

export function BoardsTable({ initialBoards }: BoardsTableProps) {
	const [data, setData] = useState(initialBoards.data)
	const [currentPage, setCurrentPage] = useState(1)
	const [totalPages, setTotalPages] = useState(initialBoards.totalPages)
	const [searchQuery, setSearchQuery] = useState('')
	const [searchType, setSearchType] = useState<'title' | 'user_id' | null>(null)

	const fetchBoards = async (page: number) => {
		const res = await getBoardsAction({ 
			page,
			...(searchType === 'user_id' ? { user_id: searchQuery } : {}),
			...(searchType === 'title' ? { title: searchQuery } : {})
		})
		if (!isActionError(res)) {
			setData(res.data)
			setCurrentPage(page)
			setTotalPages(res.totalPages)
		}
	}

	const router = useRouter()
	const deleteBoard = async (boardId: string) => {
		const res = await deleteBoardAction(boardId)
		if (isActionError(res)) {
			return toast.error(res.error)
		}
		router.refresh()
	}

	const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		let res
		if (searchQuery.startsWith('user_')) {
			setSearchType('user_id')
			res = await getBoardsAction({ page: 1, user_id: searchQuery })
		} else {
			setSearchType('title')
			res = await getBoardsAction({ page: 1, title: searchQuery })
		}
		if (!isActionError(res)) {
			setData(res.data)
			setCurrentPage(1)
			setTotalPages(res.totalPages)
		}
	}

	const handleClearSearch = () => {
		setSearchQuery('')
		setSearchType(null)
		fetchBoards(1)
	}

	return (
		<>
			<form onSubmit={handleSearch} className="flex items-center space-x-2 mb-4">
				<Input
					type="text"
					placeholder="Search boards..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="max-w-sm"
				/>
				<Button type="submit" size="icon">
					<Search className="h-4 w-4" />
				</Button>
				{searchQuery && (
					<Button type="button" variant="outline" onClick={handleClearSearch}>
						Clear
					</Button>
				)}
			</form>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="text-center">Board</TableHead>
							<TableHead className="text-center">User</TableHead>
							<TableHead className="text-center">Description</TableHead>
							<TableHead className="text-center">Pin Count</TableHead>
							<TableHead className="text-center">Secret</TableHead>
							<TableHead className="text-center">Created At</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data?.map((board) => (
							<TableRow key={board._id}>
								<TableCell className="font-medium w-[400px]">
									<Link href={`/board/${board._id}`}>
										{board.coverImages?.length > 0 ? (
											<div className="flex flex-col gap-2">
												<div className="group relative h-[250px] grid grid-cols-3 gap-[2px] rounded-lg overflow-hidden">
													<div className="relative col-span-2 overflow-hidden bg-slate-300">
														{board.coverImages[0] && (
															<Image
																src={board.coverImages[0].url || ''}
																alt={board.title}
																fill
																className="object-cover"
															/>
														)}
													</div>

													{/* Secondary Images Column */}
													<div className="relative col-span-1 grid h-full grid-rows-2 gap-[2px]">
														{Array.from({ length: 2 }, (_, index) =>
															board.coverImages[index + 1] ? (
																<div key={index} className="relative overflow-hidden">
																	<Image
																		src={board.coverImages[index + 1].url}
																		alt={`${board.title} preview ${index + 2}`}
																		fill
																		className="object-cover"
																	/>
																</div>
															) : (
																<div
																	key={index}
																	className="relative overflow-hidden bg-slate-300"
																></div>
															)
														)}
													</div>
												</div>
												<div className="flex-1">
													<p className="text-lg font-semibold">{board.title}</p>
												</div>
											</div>
										) : (
											<p className="text-lg font-semibold py-4">{board.title}</p>
										)}
									</Link>
								</TableCell>
								<TableCell
									className="text-center cursor-pointer hover:underline"
									onClick={() => {
										navigator.clipboard.writeText(board.user_id)
										toast.success('User ID copied to clipboard!')
									}}
								>
									{board.user_id.slice(0, 15) + '...'}
								</TableCell>
								<TableCell className="text-center">{board.description}</TableCell>
								<TableCell className="text-center">{board.pinCount}</TableCell>
								<TableCell className="text-center">{board.secret ? 'Yes' : 'No'}</TableCell>
								<TableCell className="text-center">{formatTime(board.createdAt)}</TableCell>
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
												onClick={() => deleteBoard(board._id)}
											>
												Delete Board
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
			<Pagination
				className="mt-4"
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={(page) => fetchBoards(page)}
			/>
		</>
	)
}
