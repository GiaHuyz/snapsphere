'use server'

import { ReportReason, ReportType } from '@/lib/constants'
import createServerAction from '@/lib/create-server-action'
import { getErrorMessage } from '@/lib/errors'
import { HttpRequest } from '@/lib/http-request'
import { revalidatePath } from 'next/cache'

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
	status: string
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

export const updateReportAction = createServerAction<{ report_id: string; status: string }, { success: boolean }>(
	async (data) => {
		try {
			const res = await HttpRequest.patch<{ success: boolean }>(`/reports/${data.report_id}`, {
				status: data.status
			})
			revalidatePath('/admin/reports')
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
			revalidatePath('/admin/reports')
			return { success: true }
		} catch (error) {
			console.error('Error deleting report:', error)
			return { success: false, error: 'Failed to delete report' }
		}
	},
	{ isAdmin: true }
)
