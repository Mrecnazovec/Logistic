export const CategoryEnum = {
	LICENSES: 'licenses',
	CONTRACTS: 'contracts',
	LOADING: 'loading',
	UNLOADING: 'unloading',
	OTHER: 'other',
} as const

export type CategoryEnum = (typeof CategoryEnum)[keyof typeof CategoryEnum]