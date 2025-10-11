export const ContactPref = {
	EMAIL: 'email',
	PHONE: 'phone',
	BOTH: 'both',
} as const

export type ContactPrefEnum = (typeof ContactPref)[keyof typeof ContactPref]

export const ContactSelector = [
	{
		type: ContactPref.EMAIL,
		name: 'По эл. почте',
	},
	{
		type: ContactPref.PHONE,
		name: 'По телефону',
	},
	{
		type: ContactPref.BOTH,
		name: 'Оба',
	},
]
