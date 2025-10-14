export const ContactPrefEnum = {
	EMAIL: 'email',
	PHONE: 'phone',
	BOTH: 'both',
} as const

export type ContactPrefEnum = (typeof ContactPrefEnum)[keyof typeof ContactPrefEnum]

export const ContactSelector = [
	{
		type: ContactPrefEnum.EMAIL,
		name: 'По эл. почте',
	},
	{
		type: ContactPrefEnum.PHONE,
		name: 'По телефону',
	},
	{
		type: ContactPrefEnum.BOTH,
		name: 'Оба',
	},
]
