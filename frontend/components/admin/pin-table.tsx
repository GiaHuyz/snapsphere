'use client'

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

const pins = [
	{
		id: '1',
		title: 'Beautiful Sunset',
		image: '/placeholder.svg',
		user: 'John Doe',
		status: 'active',
		createdAt: '2024-01-01'
	},
	{
		id: '2',
		title: 'Mountain Landscape',
		image: '/placeholder.svg',
		user: 'Jane Smith',
		status: 'active',
		createdAt: '2024-01-02'
	}
]

export function PinsTable() {
	const [loading, setLoading] = useState(false)

	const handleAction = async (pinId: string, action: 'hide' | 'delete') => {
		setLoading(true)
		try {
			// TODO: Implement pin actions
			console.log(`${action} pin ${pinId}`)
		} catch (error) {
			console.error(error)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Pin</TableHead>
						<TableHead>User</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Created At</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{pins.map((pin) => (
						<TableRow key={pin.id}>
							<TableCell className="font-medium">
								<div className="flex items-center gap-3">
									<div className="relative h-10 w-10 overflow-hidden rounded-md">
										<Image src={pin.image} alt={pin.title} fill className="object-cover" />
									</div>
									{pin.title}
								</div>
							</TableCell>
							<TableCell>{pin.user}</TableCell>
							<TableCell>
								<div
									className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
										pin.status === 'active'
											? 'bg-green-100 text-green-800'
											: 'bg-yellow-100 text-yellow-800'
									}`}
								>
									{pin.status}
								</div>
							</TableCell>
							<TableCell>{new Date(pin.createdAt).toLocaleDateString()}</TableCell>
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
										<DropdownMenuItem onClick={() => handleAction(pin.id, 'hide')}>
											Hide Pin
										</DropdownMenuItem>
										<DropdownMenuItem
											className="text-red-600"
											onClick={() => handleAction(pin.id, 'delete')}
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
	)
}

