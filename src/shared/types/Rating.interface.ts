import type { components, paths } from './api'

export type IUserRating = components['schemas']['UserRating']
export type UserRatingRequestDto = components['schemas']['UserRatingRequest']
export type PatchedUserRatingRequestDto = components['schemas']['PatchedUserRatingRequest']

export type RatingUserOrdersStats = {
	total: number
	completed: number
	in_progress: number
	queued: number
	excellent: number
}

type BaseRatingUserList = components['schemas']['RatingUserList']

export type IRatingUserList = Omit<
	BaseRatingUserList,
	'avg_rating' | 'total_distance' | 'orders_stats' | 'completed_orders' | 'city' | 'country' | 'registered_at'
> & {
	avg_rating?: number | null
	rating_count?: number | null
	total_distance?: number | string | null
	orders_stats?: RatingUserOrdersStats | null
	completed_orders?: number | null
	city?: string | null
	country?: string | null
	registered_at?: string | null
}

export type PaginatedRatingUserListList = Omit<
	components['schemas']['PaginatedRatingUserListList'],
	'results'
> & {
	results: IRatingUserList[]
}

export type RatingsListQuery =
	paths['/api/ratings/rating-users/']['get'] extends { parameters: { query?: infer Q } } ? Q : Record<string, never>
