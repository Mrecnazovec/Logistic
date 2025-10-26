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
	{ type: TransportTypeEnum.TENT, name: 'Тент' },
	{ type: TransportTypeEnum.CONT, name: 'Контейнер' },
	{ type: TransportTypeEnum.REEFER, name: 'Рефрижератор' },
	{ type: TransportTypeEnum.DUMP, name: 'Самосвал' },
	{ type: TransportTypeEnum.CARTR, name: 'Автотранспортер' },
	{ type: TransportTypeEnum.GRAIN, name: 'Зерновоз' },
	{ type: TransportTypeEnum.LOG, name: 'Лесовоз' },
	{ type: TransportTypeEnum.PICKUP, name: 'Пикап' },
	{ type: TransportTypeEnum.MEGA, name: 'Мега фура' },
	{ type: TransportTypeEnum.OTHER, name: 'Другое' },
]
