export const ContactPref = {
	EMAIL: 'email',
	PHONE: 'phone',
	BOTH: 'both',
} as const

export type ContactPrefEnum = (typeof ContactPref)[keyof typeof ContactPref]