export const PAGE_SIZE_COMMENTS = 20
export const PAGE_SIZE_PINS = 20
export const PAGE_SIZE_BOARDS = 20
export const PAGE_SIZE_USERS_LIKES = 20

export enum ReportReason {
	SPAM = 'spam',
	NUDITY = 'nudity',
	SELF_HARM = 'self-harm',
	MISINFORMATION = 'misinformation',
	HATE = 'hate',
	DANGEROUS = 'dangerous',
	HARASSMENT = 'harassment',
	VIOLENCE = 'violence',
	PRIVACY = 'privacy',
	INTELLECTUAL_PROPERTY = 'intellectual-property'
}

export enum ReportType {
    PIN = 'pin',
    COMMENT = 'comment',
    USER = 'user'
}