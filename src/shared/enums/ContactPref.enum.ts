type Translator = (key: string) => string

export const ContactPrefEnum = {
	EMAIL: 'email',
	PHONE: 'phone',
	BOTH: 'both',
} as const

export type ContactPrefEnum = (typeof ContactPrefEnum)[keyof typeof ContactPrefEnum]

export const ContactPrefSelector = [
	{
		type: ContactPrefEnum.EMAIL,
		nameKey: 'shared.contactPref.email',
	},
	{
		type: ContactPrefEnum.PHONE,
		nameKey: 'shared.contactPref.phone',
	},
	{
		type: ContactPrefEnum.BOTH,
		nameKey: 'shared.contactPref.both',
	},
] as const

const contactPrefNameKeyMap = ContactPrefSelector.reduce<Record<ContactPrefEnum, string>>((acc, pref) => {
	acc[pref.type] = pref.nameKey
	return acc
}, {} as Record<ContactPrefEnum, string>)

export function getContactPrefName(t: Translator, pref?: ContactPrefEnum | null) {
	if (!pref) return ''
	const key = contactPrefNameKeyMap[pref]
	return key ? t(key) : ''
}
