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
import { useState } from 'react'

const reports = [
	{
		id: '1',
		type: 'pin',
		reason: 'Inappropriate content',
		reporter: 'John Doe',
		reportedItem: 'Beautiful Sunset',
		status: 'pending',
		createdAt: '2024-01-01'
	},
	{
		id: '2',
		type: 'user',
		reason: 'Spam',
		reporter: 'Jane Smith',
		reportedItem: '@spammer123',
		status: 'pending',
		createdAt: '2024-01-02'
	}
]

export function ReportsTable() {
	const [loading, setLoading] = useState(false)

	const handleAction = async (reportId: string, action: 'approve' | 'reject') => {
		setLoading(true)
		try {
			// TODO: Implement report actions
			console.log(`${action} report ${reportId}`)
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
						<TableHead>Type</TableHead>
						<TableHead>Reason</TableHead>
						<TableHead>Reporter</TableHead>
						<TableHead>Reported Item</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Created At</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{reports.map((report) => (
						<TableRow key={report.id}>
							<TableCell className="font-medium">
								<div
									className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
										report.type === 'pin'
											? 'bg-blue-100 text-blue-800'
											: 'bg-purple-100 text-purple-800'
									}`}
								>
									{report.type}
								</div>
							</TableCell>
							<TableCell>{report.reason}</TableCell>
							<TableCell>{report.reporter}</TableCell>
							<TableCell>{report.reportedItem}</TableCell>
							<TableCell>
								<div
									className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
										report.status === 'pending'
											? 'bg-yellow-100 text-yellow-800'
											: report.status === 'approved'
											? 'bg-green-100 text-green-800'
											: 'bg-red-100 text-red-800'
									}`}
								>
									{report.status}
								</div>
							</TableCell>
							<TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
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
											className="text-green-600"
											onClick={() => handleAction(report.id, 'approve')}
										>
											Approve Report
										</DropdownMenuItem>
										<DropdownMenuItem
											className="text-red-600"
											onClick={() => handleAction(report.id, 'reject')}
										>
											Reject Report
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

