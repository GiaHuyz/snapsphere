'use client'

import { updateUserStatus } from '@/actions/admin-actions'
import { deleteCommentAction, IComment } from '@/actions/comment-action'
import { deletePinAction, Pin } from '@/actions/pin-actions'
import { getReportDetailAction, ReportDetail } from '@/actions/report-actions'
import { LoaderButton } from '@/components/loading-button'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ReportType } from '@/lib/constants'
import { isActionError } from '@/lib/errors'
import { User } from '@clerk/nextjs/server'
import { Loader } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

interface ReportDetailModalProps {
	isOpen: boolean
	onClose: () => void
	reportId: string
	itemId: string
	reporterId: string
	type: ReportType
	handleDeleteReport: (id: string) => void
}

export function ReportDetailModal({
	isOpen,
	onClose,
	reportId,
	itemId,
	reporterId,
	type,
	handleDeleteReport
}: ReportDetailModalProps) {
	const [report, setReport] = useState<ReportDetail | null>(null)
	const [loading, setLoading] = useState(false)
	const [showDeleteAlert, setShowDeleteAlert] = useState(false)
	const [loadingDelete, setLoadingDelete] = useState(false)

	const fetchReportDetail = useCallback(
		async (itemId: string) => {
			setLoading(true)
			const reportDetail = await getReportDetailAction({ reportId: itemId, type, reporterId })
			if (isActionError(reportDetail)) {
				return toast.error(reportDetail.error)
			}
			setReport(reportDetail)
			setLoading(false)
		},
		[type, reporterId]
	)

	const handleDelete = async ({ itemId, type }: { itemId: string; type: ReportType }) => {
		setLoadingDelete(true)
		if (type === ReportType.PIN) {
			const res = await deletePinAction(itemId)
			if (isActionError(res)) {
				setLoadingDelete(false)
				return toast.error(res.error)
			}
		} else if (type === ReportType.COMMENT) {
			const res = await deleteCommentAction(itemId)
			if (isActionError(res)) {
				setLoadingDelete(false)
				return toast.error(res.error)
			}
		} else if (type === ReportType.USER) {
			const res = await updateUserStatus(itemId, 'ban')
			if (isActionError(res)) {
				setLoadingDelete(false)
				return toast.error(res.error)
			}
		}
		handleDeleteReport(reportId)
		setLoadingDelete(false)
		onClose()
	}

	useEffect(() => {
		if (itemId) {
			fetchReportDetail(itemId)
		}
	}, [fetchReportDetail, itemId])

	return (
		<>
			<Dialog open={isOpen} onOpenChange={onClose}>
				<DialogContent
					className="w-11/12 rounded-2xl sm:max-w-[630px] sm:rounded-2xl max-h-[calc(100vh-64px)] overflow-y-auto"
					aria-describedby="report-details"
				>
					<DialogHeader>
						<DialogTitle>Report Details</DialogTitle>
					</DialogHeader>
					{loading && (
						<div className="flex justify-center items-center h-full">
							<Loader className="animate-spin h-5 w-5" />
						</div>
					)}
					{!loading && report && (
						<div className="space-y-4">
							<div>
								<h3 className="text-lg font-semibold">Reporter</h3>
								<div className="mt-4 flex gap-4 items-center">
									<div>
										<Image
											src={report.reporter.imageUrl}
											alt={report.reporter.firstName + ' ' + report.reporter.lastName || 'Avatar'}
											width={50}
											height={50}
											className="object-fill w-full max-h-[50px] rounded-full"
											priority
										/>
									</div>
									<div>
										<p>
											<span className="font-bold">ID:</span> {report.reporter.id}
										</p>
										<p>
											<span className="font-bold">Email:</span>{' '}
											{report.reporter?.emailAddresses?.length > 0
												? report.reporter.emailAddresses[0].emailAddress
												: 'N/A'}
										</p>
										<p>
											<span className="font-bold">Username:</span> {report.reporter.username}
										</p>
										<p>
											<span className="font-bold">Full Name:</span>{' '}
											{report.reporter.firstName + ' ' + report.reporter.lastName}
										</p>
									</div>
								</div>
							</div>
							<div>
								<h3 className="text-lg font-semibold">Reported Item</h3>
								{type === ReportType.PIN && (
									<>
										<Image
											src={(report.reportedItem as Pin).url}
											alt={(report.reportedItem as Pin).title || 'Pin Image'}
											width={300}
											height={300}
											className="mt-2 mb-4 object-fill w-full h-auto max-h-[500px] rounded-2xl"
											priority
										/>
										<p>
											<span className="font-bold">Title:</span>{' '}
											{(report.reportedItem as Pin).title}
										</p>
										<p>
											<span className="font-bold">Description:</span>{' '}
											{(report.reportedItem as Pin).description}
										</p>
										<p>
											<span className="font-bold">Secret:</span>{' '}
											{(report.reportedItem as Pin).secret === true ? 'Yes' : 'No'}
										</p>
										<p className="break-all">
											<span className="font-bold">Public Id:</span>{' '}
											{(report.reportedItem as Pin).url?.split('/').slice(-2).join('/')}
										</p>
										<p>
											<span className="font-bold">Reference Link:</span>{' '}
											<Link
												href={(report.reportedItem as Pin).referenceLink}
												className="hover:underline break-all text-blue-600"
											>
												{(report.reportedItem as Pin).referenceLink}
											</Link>
										</p>
										<p>
											<span className="font-bold">Allow Comment:</span>{' '}
											{(report.reportedItem as Pin).isAllowedComment === true ? 'Yes' : 'No'}
										</p>
										<p>
											<span className="font-bold">Save Count:</span>{' '}
											{(report.reportedItem as Pin).saveCount}
										</p>
										<p>
											<span className="font-bold">Like Count:</span>{' '}
											{(report.reportedItem as Pin).likeCount}
										</p>
									</>
								)}
								{type === ReportType.COMMENT && (
									<>
										<p>
											<span className="font-bold">Content:</span>{' '}
											{(report.reportedItem as IComment).content}
										</p>
										{(report.reportedItem as IComment).image && (
											<Image
												src={(report.reportedItem as IComment).image || 'Image'}
												alt={(report.reportedItem as IComment).content || 'Comment Image'}
												width={300}
												height={300}
												className="mt-2 mb-4 object-fill w-full h-auto max-h-[500px] rounded-2xl"
												priority
											/>
										)}
										<p>
											<span className="font-bold">Pin:</span>{' '}
											<Link
												href={`/pin/${(report.reportedItem as IComment).pin_id}`}
												className="hover:underline"
											>
												{(report.reportedItem as IComment).pin_id}
											</Link>
										</p>
										<p>
											<span className="font-bold">Reply Count:</span>{' '}
											{(report.reportedItem as IComment).replyCount}
										</p>
										<p>
											<span className="font-bold">User Id:</span>{' '}
											{(report.reportedItem as IComment).user_id}
										</p>
									</>
								)}
								{type === ReportType.USER && (
									<div className="mt-4 flex gap-4 items-center">
										<div>
											<Image
												src={(report.reportedItem as User).imageUrl}
												alt={
													(report.reportedItem as User).firstName +
														' ' +
														(report.reportedItem as User).lastName || 'Avatar'
												}
												width={50}
												height={50}
												className="object-fill w-full max-h-[50px] rounded-full"
												priority
											/>
										</div>
										<div>
											<p>
												<span className="font-bold">ID:</span>{' '}
												{(report.reportedItem as User).id}
											</p>
											<p>
												<span className="font-bold">Email:</span>{' '}
												{(report.reportedItem as User)?.emailAddresses?.length > 0 &&
													(report.reportedItem as User).emailAddresses[0].emailAddress}
											</p>
											<p>
												<span className="font-bold">Username:</span>{' '}
												{(report.reportedItem as User).username}
											</p>
											<p>
												<span className="font-bold">Full Name:</span>{' '}
												{(report.reportedItem as User).firstName +
													' ' +
													(report.reportedItem as User).lastName}
											</p>
										</div>
									</div>
								)}
							</div>
						</div>
					)}
					<DialogFooter className="gap-2 sm:gap-0 sm:justify-between">
						<Button type="button" className="rounded-full" onClick={onClose}>
							Close
						</Button>
						<LoaderButton
							type="button"
							variant="destructive"
							onClick={() => setShowDeleteAlert(true)}
							isLoading={loadingDelete}
							className="rounded-full"
						>
							{type === ReportType.USER ? 'Ban' : 'Delete'}
						</LoaderButton>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			<AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete{' '}
							{type === ReportType.PIN ? 'pin' : type === ReportType.COMMENT ? 'comment' : 'user'}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => handleDelete({ itemId, type })}
							className="bg-red-500 hover:bg-red-600"
						>
							{type === ReportType.USER ? 'Ban' : 'Delete'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}
