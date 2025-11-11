import { IUserRating } from './Rating.interface'

export type IRatingTableRow = IUserRating & {
	carrier_name: string
	driver_name: string
	login: string
	registered_at: string
	orders_completed: number
}
