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
		name: 'РўРµР»РµС„РѕРЅ',
	},
	{
		type: ContactPrefEnum.BOTH,
		name: 'РћР±Р°',
	},
]

const contactPrefNameMap = ContactPrefSelector.reduce<Record<ContactPrefEnum, string>>((acc, pref) => {
	acc[pref.type] = pref.name
	return acc
}, {} as Record<ContactPrefEnum, string>)

export function getContactPrefName(pref?: ContactPrefEnum | null) {
	if (!pref) return ''
	return contactPrefNameMap[pref] ?? ''
}
