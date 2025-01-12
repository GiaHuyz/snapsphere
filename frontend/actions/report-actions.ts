'use server'

import { IComment } from '@/actions/comment-action'
import { Pin } from '@/actions/pin-actions'
import { ReportReason, ReportType } from '@/lib/constants'
import createServerAction from '@/lib/create-server-action'
import { getErrorMessage } from '@/lib/errors'
import { HttpRequest } from '@/lib/http-request'
import { clerkClient, User } from '@clerk/nextjs/server'

export interface ReportData {
	item_id: string
	reason: ReportReason
	type: ReportType
}

export interface Report {
	_id: string
	user_id: string
	item_id: string
	reason: ReportReason
	type: ReportType
	createdAt: string
}

export interface ReportPage {
	data: Report[]
	totalPages: number
}

export interface QueryParams {
	reason?: ReportReason
	type?: ReportType
	status?: string
	page?: number
	pageSize?: number
}

export interface ReportDetail {
	reporter: User
	reportedItem: Pin | IComment | User
}

export const createReportAction = createServerAction<ReportData, Report>(async (data) => {
	try {
		const res = await HttpRequest.post<Report>('/reports', data)
		return res
	} catch (error) {
		return { error: getErrorMessage(error) }
	}
})

export const getReportsAction = createServerAction<QueryParams, ReportPage>(
	async (queryParams) => {
		try {
			queryParams.page = queryParams.page || 1
			queryParams.pageSize = queryParams.pageSize || 10

			const queryString = Object.entries(queryParams)
				.filter(([, value]) => value !== undefined)
				.map(([key, value]) => `${key}=${value}`)
				.join('&')

			const res = await HttpRequest.get<ReportPage>(`/reports?${queryString}`)
			return res
		} catch (error) {
			return { error: getErrorMessage(error) }
		}
	},
	{ isAdmin: true }
)

export const deleteReportAction = createServerAction<string, { success: boolean }>(
	async (reportId) => {
		try {
			await HttpRequest.delete(`/reports/${reportId}`)
			return { success: true }
		} catch (error) {
			console.error('Error deleting report:', error)
			return { success: false, error: 'Failed to delete report' }
		}
	},
	{ isAdmin: true }
)

export const getReportDetailAction = createServerAction<
	{ reporterId: string; reportId: string; type: ReportType },
	ReportDetail
>(async (data) => {
	try {
		let reportDetail: Pin | IComment | User | null = null
		switch (data.type) {
			case 'pin':
				reportDetail = await HttpRequest.get<Pin>(`/pins/${data.reportId}`)
				break
			case 'comment':
				reportDetail = await HttpRequest.get<IComment>(`/comments/${data.reportId}`)
				break
			case 'user':
				reportDetail = await (await clerkClient()).users.getUser(data.reportId)
				reportDetail = JSON.parse(JSON.stringify(reportDetail))
				break
		}
		const user = await (await clerkClient()).users.getUser(data.reporterId)
		return {
			reporter: JSON.parse(JSON.stringify(user)),
			reportedItem: reportDetail as Pin | IComment | User
		}
	} catch (error) {
		return { error: getErrorMessage(error) }
	}
})
