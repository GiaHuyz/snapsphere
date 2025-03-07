'use client'

import { deleteUser, getUsers, updateUserStatus } from '@/actions/admin-actions'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Pagination } from '@/components/ui/pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { isActionError } from '@/lib/errors'
import { User } from '@clerk/nextjs/server'
import { MoreHorizontal, Search } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface UsersTableProps {
	initialData: {
		users: User[]
		totalPages: number
		currentPage: number
	}
}

export function UsersTable({ initialData }: UsersTableProps) {
	const [users, setUsers] = useState<User[]>(initialData.users)
	const [searchQuery, setSearchQuery] = useState('')
	const [totalPages, setTotalPages] = useState(initialData.totalPages)
	const [currentPage, setCurrentPage] = useState(1)

	const fetchUsers = async (page: number, query: string = '') => {
		const data = await getUsers(page, query)

		if (!isActionError(data)) {
			setUsers(data.users)
			setTotalPages(data.totalPages)
			setCurrentPage(page)
		}
	}

	const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		fetchUsers(1, searchQuery)
	}

	const handleAction = async (userId: string, action: 'ban' | 'unban' | 'delete') => {
		try {
			if (action === 'delete') {
				await deleteUser(userId)
			} else if (action === 'ban') {
				await updateUserStatus(userId, 'ban')
			} else if (action === 'unban') {
				await updateUserStatus(userId, 'unban')
			}

			toast.success(`User ${action}ed successfully`)

			fetchUsers(currentPage, searchQuery)
		} catch (error) {
			console.error(`Error ${action}ing user:`, error)
			toast.error(`Failed to ${action} user`)
		}
	}

	return (
		<div className="space-y-4">
			<form onSubmit={handleSearch} className="flex items-center space-x-2">
				<Input
					type="text"
					placeholder="Search users..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="max-w-sm"
				/>
				<Button type="submit" size="icon">
					<Search className="h-4 w-4" />
				</Button>
			</form>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>User</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Created At</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{users.map((user) => (
							<TableRow key={user.id}>
								<TableCell className="font-medium">
									<div className="flex items-center gap-3">
										<Avatar className="h-8 w-8">
											<AvatarImage src={user.imageUrl} />
											<AvatarFallback>
												{user.firstName?.[0]}
												{user.lastName?.[0]}
											</AvatarFallback>
										</Avatar>
										{user.firstName} {user.lastName}
									</div>
								</TableCell>
								<TableCell>{user.emailAddresses[0]?.emailAddress}</TableCell>
								<TableCell>
									<div
										className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
											user.banned
												? 'bg-yellow-100 text-yellow-800'
												: 'bg-green-100 text-green-800'
										}`}
									>
										{user.banned ? 'Banned' : 'Active'}
									</div>
								</TableCell>
								<TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
								<TableCell className="text-right">
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" className="h-8 w-8 p-0">
												<span className="sr-only">Open menu</span>
												<MoreHorizontal className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuLabel>Actions</DropdownMenuLabel>
											<DropdownMenuItem
												className="cursor-pointer"
												onClick={() => handleAction(user.id, user.banned ? 'unban' : 'ban')}
											>
												{user.banned ? 'Unban' : 'Ban'} User
											</DropdownMenuItem>
											<DropdownMenuItem
												className="text-red-600 cursor-pointer"
												onClick={() => handleAction(user.id, 'delete')}
											>
												Delete User
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
				onPageChange={(page) => fetchUsers(page, searchQuery)}
			/>
		</div>
	)
}
