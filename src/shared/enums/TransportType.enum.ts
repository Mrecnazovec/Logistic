export const TransportTypeEnum = {
	TENT: 'TENT',
	CONT: 'CONT',
	REEFER: 'REEFER',
	DUMP: 'DUMP',
	CARTR: 'CARTR',
	GRAIN: 'GRAIN',
	LOG: 'LOG',
	PICKUP: 'PICKUP',
	MEGA: 'MEGA',
	OTHER: 'OTHER',
} as const

export type TransportTypeEnum = (typeof TransportTypeEnum)[keyof typeof TransportTypeEnum]

export const TransportSelect = [
	{ type: TransportTypeEnum.TENT, name: 'Тент', symb: 'Т' },
	{ type: TransportTypeEnum.CONT, name: 'Контейнер', symb: 'К' },
	{ type: TransportTypeEnum.REEFER, name: 'Рефрижератор', symb: 'Р' },
	{ type: TransportTypeEnum.DUMP, name: 'Самосвал', symb: 'С' },
	{ type: TransportTypeEnum.CARTR, name: 'Автотранспортер', symb: 'А' },
	{ type: TransportTypeEnum.GRAIN, name: 'Зерновоз', symb: 'З' },
	{ type: TransportTypeEnum.LOG, name: 'Лесовоз', symb: 'Л' },
	{ type: TransportTypeEnum.PICKUP, name: 'Пикап', symb: 'П' },
	{ type: TransportTypeEnum.MEGA, name: 'Мега фура', symb: 'М' },
	{ type: TransportTypeEnum.OTHER, name: 'Другое', symb: 'Др' },
]

const transportNameMap = TransportSelect.reduce<Record<TransportTypeEnum, string>>((acc, transport) => {
	acc[transport.type] = transport.name
	return acc
}, {} as Record<TransportTypeEnum, string>)

export function getTransportName(type?: TransportTypeEnum | null) {
	if (!type) return ''
	return transportNameMap[type] ?? ''
}
