type Translator = (key: string) => string

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
	{ type: TransportTypeEnum.TENT, nameKey: 'shared.transport.type.tent', symbKey: 'shared.transport.symbol.tent' },
	{ type: TransportTypeEnum.CONT, nameKey: 'shared.transport.type.cont', symbKey: 'shared.transport.symbol.cont' },
	{ type: TransportTypeEnum.REEFER, nameKey: 'shared.transport.type.reefer', symbKey: 'shared.transport.symbol.reefer' },
	{ type: TransportTypeEnum.DUMP, nameKey: 'shared.transport.type.dump', symbKey: 'shared.transport.symbol.dump' },
	{ type: TransportTypeEnum.CARTR, nameKey: 'shared.transport.type.cartr', symbKey: 'shared.transport.symbol.cartr' },
	{ type: TransportTypeEnum.GRAIN, nameKey: 'shared.transport.type.grain', symbKey: 'shared.transport.symbol.grain' },
	{ type: TransportTypeEnum.LOG, nameKey: 'shared.transport.type.log', symbKey: 'shared.transport.symbol.log' },
	{ type: TransportTypeEnum.PICKUP, nameKey: 'shared.transport.type.pickup', symbKey: 'shared.transport.symbol.pickup' },
	{ type: TransportTypeEnum.MEGA, nameKey: 'shared.transport.type.mega', symbKey: 'shared.transport.symbol.mega' },
	{ type: TransportTypeEnum.OTHER, nameKey: 'shared.transport.type.other', symbKey: 'shared.transport.symbol.other' },
] as const

const transportNameKeyMap = TransportSelect.reduce<Record<TransportTypeEnum, string>>((acc, transport) => {
	acc[transport.type] = transport.nameKey
	return acc
}, {} as Record<TransportTypeEnum, string>)

const transportSymbolKeyMap = TransportSelect.reduce<Record<TransportTypeEnum, string>>((acc, transport) => {
	acc[transport.type] = transport.symbKey
	return acc
}, {} as Record<TransportTypeEnum, string>)

export function getTransportName(t: Translator, type?: TransportTypeEnum | null) {
	if (!type) return ''
	const key = transportNameKeyMap[type]
	return key ? t(key) : ''
}

export function getTransportSymbol(t: Translator, type?: TransportTypeEnum | null) {
	if (!type) return ''
	const key = transportSymbolKeyMap[type]
	return key ? t(key) : ''
}
