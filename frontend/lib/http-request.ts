/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers"

export class HttpRequest {
	private static async getHeaders(): Promise<Record<string, string>> {
		const cookieStore = await cookies()
		return {
			'Content-Type': 'application/json',
			Cookie: cookieStore.toString()
		}
	}

	private static buildUrl(endpoint: string) {
		let baseUrl = process.env.API_URL!
		if (baseUrl.endsWith('/')) {
			baseUrl = baseUrl.slice(0, -1)
		}
		if (endpoint.startsWith('/')) {
			endpoint = endpoint.slice(1)
		}
		return `${baseUrl}/${endpoint}`
	}

	private static async request<T>(endpoint: string, method: string, body?: any, options?: RequestInit): Promise<T> {
		const headers = await this.getHeaders()

        if (!body) {
            delete headers['Content-Type']
        }

		const response = await fetch(this.buildUrl(endpoint), {
			method,
			headers,
			body: body ? JSON.stringify(body) : undefined,
			...options
		})
		return this.handleResponse<T>(response)
	}

	private static async handleResponse<T>(response: Response): Promise<T> {
		if (!response.ok) {
			const error = await response.json()
			throw new Error(error.message) || 'Something went wrong'
		}

        if (!response.headers.get('Content-Type') || response.headers.get('Content-Length') === '0') {
            return null as T
        }
        
		const data = await response.json()
		return data
	}

	static async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
		return this.request<T>(endpoint, 'GET', undefined, options)
	}

	static async post<T>(endpoint: string, body: any, options?: RequestInit): Promise<T> {
		return this.request<T>(endpoint, 'POST', body, options)
	}

	static async patch<T>(endpoint: string, body: any, options?: RequestInit): Promise<T> {
		return this.request<T>(endpoint, 'PATCH', body, options)
	}

	static async delete(endpoint: string, options?: RequestInit): Promise<void> {
		return this.request(endpoint, 'DELETE', undefined, options)
	}
}
