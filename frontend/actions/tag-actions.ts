'use server'

import { PAGE_SIZE_TAGS } from '@/lib/constants'
import createServerAction from '@/lib/create-server-action'
import { getErrorMessage } from '@/lib/errors'
import { HttpRequest } from '@/lib/http-request'

export type Tag = {
	_id: string
	name: string
    createdAt: string
}

type FilterTagDto = {
    page?: number
    pageSize?: number
    name?: string
}

export type TagPage = {
    tags: Tag[]
    totalPages: number
}

export const getTagsAction = createServerAction<FilterTagDto, TagPage>(
	async (data: FilterTagDto) => {
		try {
            data.page = data.page || 1
            data.pageSize = data.pageSize || PAGE_SIZE_TAGS
            const query = Object.entries(data)
                .filter(([, value]) => value !== undefined)
                .map(([key, value]) => `${key}=${value}`)
                .join('&')
			const tags = await HttpRequest.get<TagPage>(`/tags?${query}`)
			return tags
		} catch (error) {
			return { error: getErrorMessage(error) }
		}
	},
	{ requireAuth: false }
)

export const createTagAction = createServerAction(async (name: string) => {
	try {
		const newTag = await HttpRequest.post<Tag>('/tags', { name })
		return newTag
	} catch (error) {
		return { error: getErrorMessage(error) }
	}
})

export const deleteTagAction = createServerAction(async (id: string) => {
	try {
		await HttpRequest.delete(`/tags/${id}`)
	} catch (error) {
		return { error: getErrorMessage(error) }
	}
})
