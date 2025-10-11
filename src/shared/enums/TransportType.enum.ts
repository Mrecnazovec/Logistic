export const TransportType = {
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

export type TransportTypeEnum = (typeof TransportType)[keyof typeof TransportType]

export const TransportSelector = [
	{ type: TransportType.TENT, name: 'Тент' },
	{ type: TransportType.CONT, name: 'Контейнер' },
	{ type: TransportType.REEFER, name: 'Рефрижератор' },
	{ type: TransportType.DUMP, name: 'Самосвал' },
	{ type: TransportType.CARTR, name: 'Автотранспортер' },
	{ type: TransportType.GRAIN, name: 'Зерновоз' },
	{ type: TransportType.LOG, name: 'Лесовоз' },
	{ type: TransportType.PICKUP, name: 'Пикап' },
	{ type: TransportType.MEGA, name: 'Мега фура' },
	{ type: TransportType.OTHER, name: 'Другое' },
]
