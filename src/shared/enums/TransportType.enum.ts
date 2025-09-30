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
