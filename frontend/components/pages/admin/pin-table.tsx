'use client'

import { deletePinAction, getAllPinsUserAction, getPinDetailAction, PinPage } from '@/actions/pin-actions'
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

export function PinsTable({ initialPins }: { initialPins: PinPage }) {
	const [data, setData] = useState(initialPins.data)
	const [currentPage, setCurrentPage] = useState(1)
	const [totalPages, setTotalPages] = useState(initialPins.totalPages)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchType, setSearchType] = useState<'id' | 'user_id' | 'search' | null>(null)

	const fetchPins = async (page: number) => {
		const res = await getAllPinsUserAction({ 
            page,
            ...(searchType === 'id' ? { id: searchQuery } : {}),
            ...(searchType === 'user_id' ? { user_id: searchQuery } : {}),
            ...(searchType === 'search' ? { search: searchQuery } : {})
        })
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

    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        let res
        if (searchQuery.match(/^[a-f\d]{24}$/i)) {
            setSearchType('id')
            res = await getPinDetailAction(searchQuery)
            if (!isActionError(res)) {
                setData([res])
                setCurrentPage(1)
                setTotalPages(1)
            }
            return
        } 
        if (searchQuery.startsWith('user_')) {
            setSearchType('user_id')
            res = await getAllPinsUserAction({ page: 1, user_id: searchQuery })
        } else {
            setSearchType('search')
            res = await getAllPinsUserAction({ page: 1, search: searchQuery })
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
        fetchPins(1)
    }

	return (
		<>
			<form onSubmit={handleSearch} className="flex items-center space-x-2 mb-4">
				<Input
					type="text"
					placeholder="Search pins..."
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
							<TableHead className="text-center">Pin</TableHead>
							<TableHead className="text-center">User</TableHead>
							<TableHead className="text-center">Tags</TableHead>
							<TableHead className="text-center">Reference Link</TableHead>
							<TableHead className="text-center">Allow Comment</TableHead>
							<TableHead className="text-center">Comment Count</TableHead>
							<TableHead className="text-center">Save Count</TableHead>
							<TableHead className="text-center">Like Count</TableHead>
							<TableHead className="text-center">Secret</TableHead>
							<TableHead className="text-center">Created At</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data?.map((pin) => (
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
												<p className="text-sm text-muted-foreground">{pin.description}</p>
											</div>
										</div>
									</Link>
								</TableCell>
								<TableCell
									className="text-center cursor-pointer hover:underline"
									onClick={() => {
										navigator.clipboard.writeText(pin.user_id)
										toast.success('User ID copied to clipboard!')
									}}
								>
									{pin.user_id.slice(0, 15) + '...'}
								</TableCell>
								<TableCell className="text-center w-[200px]">{pin.tags.join(', ')}</TableCell>
								<TableCell className="text-center text-blue-600 hover:underline">
									{pin.referenceLink ? (
										<Link href={pin.referenceLink}>{pin.referenceLink.slice(0, 20) + '...'}</Link>
									) : (
										''
									)}
								</TableCell>
								<TableCell className="text-center">{pin.isAllowedComment ? 'Yes' : 'No'}</TableCell>
								<TableCell className="text-center">{pin.commentCount}</TableCell>
								<TableCell className="text-center">{pin.saveCount}</TableCell>
								<TableCell className="text-center">{pin.likeCount}</TableCell>
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
			</div>
			<Pagination
				className="mt-4"
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={(page) => fetchPins(page)}
			/>
		</>
	)
}
