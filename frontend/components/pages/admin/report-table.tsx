'use client'

import {
	deleteReportAction,
	getReportsAction,
	QueryParams,
	Report,
	ReportPage,
	updateReportAction
} from '@/actions/report-actions'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Pagination } from '@/components/ui/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ReportReason, ReportType } from '@/lib/constants'
import { formatTime } from '@/lib/format-time'
import { MoreHorizontal } from 'lucide-react'
import { useState } from 'react'

export function ReportsTable({ initialData }: { initialData: ReportPage }) {
	const [data, setData] = useState<Report[]>(initialData.data)
	const [totalPages, setTotalPages] = useState<number>(initialData.totalPages)
	const [currentPage, setCurrentPage] = useState(1)
    const [filter, setFilter] = useState({})

	const fetchReports = async (page: number, query: QueryParams) => {
		const data = (await getReportsAction({ ...query, page })) as ReportPage
		setData(data.data)
		setTotalPages(data.totalPages)
		setCurrentPage(page)
	}

	const handleAction = async (reportId: string, action: 'approved' | 'delete') => {
		if (action === 'delete') {
			await deleteReportAction(reportId)
		} else {
			await updateReportAction({ report_id: reportId, status: action })
		}
	}

	const handleFilter = async (type: 'reason' | 'type', value: string) => {
		if (value === 'None') {
			setData(initialData.data)
			return
		}
		const queryParams = {
			[type]: value || undefined
		}
		setFilter(queryParams)
		fetchReports(1, queryParams)
	}

	return (
		<div className="space-y-4">
			<div className="flex gap-4 justify-end">
				<Select onValueChange={(value) => handleFilter('reason', value)}>
					<SelectTrigger className="w-[200px]">
						<SelectValue placeholder="Filter by Reason" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="None">None</SelectItem>
						{Object.values(ReportReason).map((reason) => (
							<SelectItem key={reason} value={reason}>
								{reason}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Select onValueChange={(value) => handleFilter('type', value)}>
					<SelectTrigger className="w-[200px]">
						<SelectValue placeholder="Filter by Type" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="None">None</SelectItem>
						{Object.values(ReportType).map((type) => (
							<SelectItem key={type} value={type}>
								{type}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
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
						{data.map((report) => (
							<TableRow key={report._id}>
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
								<TableCell>{report.user_id}</TableCell>
								<TableCell>{report.item_id}</TableCell>
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
								<TableCell>{formatTime(report.createdAt)}</TableCell>
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
												className="text-green-600 cursor-pointer"
												onClick={() => handleAction(report._id, 'approved')}
											>
												Approve Report
											</DropdownMenuItem>
											<DropdownMenuItem
												className="text-red-600 cursor-pointer"
												onClick={() => handleAction(report._id, 'delete')}
											>
												Delete Report
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
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={(page) => fetchReports(page, filter)}
			/>
		</div>
	)
}
