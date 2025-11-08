export const ContactPrefEnum = {
	EMAIL: 'email',
	PHONE: 'phone',
	BOTH: 'both',
} as const

export type ContactPrefEnum = (typeof ContactPrefEnum)[keyof typeof ContactPrefEnum]

export const ContactPrefSelector = [
	{
		type: ContactPrefEnum.EMAIL,
		name: 'Email',
	},
	{
		type: ContactPrefEnum.PHONE,
		name: 'Телефон',
	},
	{
		type: ContactPrefEnum.BOTH,
		name: 'Оба',
	},
]
