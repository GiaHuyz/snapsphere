export type ActionError = { error: string }
export type ServerActionResponse<T> = ActionError | T 

export function isActionError(error: unknown): error is ActionError {
    return (
        typeof error === 'object' &&
        error != null &&
        'error' in error &&
        typeof (error as ActionError).error === 'string'
    )
}

export const getErrorMessage = (error: unknown) => {
    if (error instanceof Error) {
        return error.message
    }
    return 'Something went wrong'
}