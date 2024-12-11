import { format, formatDistanceToNow } from 'date-fns'

export function formatTime(time: string | Date): string {
    const now = new Date()
    const inputDate = new Date(time)

    const oneWeekInMs = 7 * 24 * 60 * 60 * 1000
    const timeDiff = now.getTime() - inputDate.getTime()

    if (timeDiff < oneWeekInMs) {
        return formatDistanceToNow(inputDate, { addSuffix: true })
    }

    return format(inputDate, 'dd/MM/yyyy')
}