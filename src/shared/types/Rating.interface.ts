import type { components, paths } from './api'

export type IUserRating = components['schemas']['UserRating']
export type UserRatingRequestDto = components['schemas']['UserRatingRequest']
export type PatchedUserRatingRequestDto = components['schemas']['PatchedUserRatingRequest']

export type IRatingUserList = components['schemas']['RatingUserList']
export type PaginatedRatingUserListList = components['schemas']['PaginatedRatingUserListList']

export type RatingsListQuery =
	paths['/api/ratings/rating-users/']['get'] extends { parameters: { query?: infer Q } } ? Q : Record<string, never>
