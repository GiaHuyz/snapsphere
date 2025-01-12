'use client'

import { deleteReportAction, getReportsAction, QueryParams, Report, ReportPage } from '@/actions/report-actions'
import { ReportDetailModal } from '@/components/modals/report-detail-modal'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/ui/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ReportReason, ReportType } from '@/lib/constants'
import { isActionError } from '@/lib/errors'
import { formatTime } from '@/lib/format-time'
import { Trash } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export function ReportsTable({ initialData }: { initialData: ReportPage }) {
	const [data, setData] = useState<Report[]>(initialData.data)
	const [totalPages, setTotalPages] = useState<number>(initialData.totalPages)
	const [currentPage, setCurrentPage] = useState(1)
	const [filter, setFilter] = useState({})
	const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
	const [selectedReport, setSelectedReport] = useState({
		reportId: '',
		itemId: '',
		reporterId: '',
		type: ReportType.PIN
	})

	const fetchReports = async (page: number, query: QueryParams) => {
		const data = (await getReportsAction({ ...query, page })) as ReportPage
		setData(data.data)
		setTotalPages(data.totalPages)
		setCurrentPage(page)
	}

	const handleDelete = async (reportId: string) => {
		const res = await deleteReportAction(reportId)
		if (isActionError(res)) {
			return toast.error(res.error)
		}
		setData(data.filter((report) => report._id !== reportId))
		toast.success('Report deleted successfully')
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

	const handleReportClick = ({
		reportId,
		type,
		itemId,
		reporterId
	}: {
		reportId: string
		type: ReportType
		itemId: string
		reporterId: string
	}) => {
		setSelectedReport({ reportId, itemId, reporterId, type })
		setIsDetailModalOpen(true)
	}

	const handleClose = () => {
		setIsDetailModalOpen(false)
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
							<TableHead>Created At</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.map((report) => (
							<TableRow
								key={report._id}
								onClick={() =>
									handleReportClick({
										reporterId: report.user_id,
										reportId: report._id,
										type: report.type,
                                        itemId: report.item_id
									})
								}
								className="cursor-pointer"
							>
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
								<TableCell>{formatTime(report.createdAt)}</TableCell>
								<TableCell className="text-right">
									<Button
										className="bg-red-600 hover:bg-red-500 p-3"
										onClick={(e) => {
											e.stopPropagation()
											handleDelete(report._id)
										}}
									>
										<Trash className="h-4 w-4" />
										<span className="sr-only">Delete</span>
									</Button>
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
			<ReportDetailModal
				isOpen={isDetailModalOpen}
				onClose={handleClose}
                handleDeleteReport={handleDelete}
				reportId={selectedReport.reportId}
				itemId={selectedReport.itemId}
				reporterId={selectedReport.reporterId}
				type={selectedReport.type}
			/>
		</div>
	)
}
