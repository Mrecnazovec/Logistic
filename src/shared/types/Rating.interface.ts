import type { components, paths } from './api'

export type IUserRating = components['schemas']['UserRating']
export type UserRatingRequestDto = components['schemas']['UserRatingRequest'] & {
	rated_user: number
	order: number
}
export type PatchedUserRatingRequestDto = components['schemas']['PatchedUserRatingRequest']

export type RatingUserPieChart = {
	in_search: number
	in_process: number
	successful: number
	cancelled: number
	total?: number
}

type BaseRatingUserList = components['schemas']['RatingUserList']

export type IRatingUserList = Omit<
	BaseRatingUserList,
	'avg_rating' | 'total_distance' | 'pie_chart' | 'completed_orders' | 'city' | 'country' | 'registered_at'
> & {
	avg_rating?: number | null
	rating_count?: number | null
	total_distance?: number | string | null
	pie_chart?: RatingUserPieChart | string | null
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
