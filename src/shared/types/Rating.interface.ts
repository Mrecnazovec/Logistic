import type { components, paths } from './api'

export type IUserRating = components['schemas']['UserRating']
export type UserRatingRequestDto = components['schemas']['UserRatingRequest']
export type PatchedUserRatingRequestDto = components['schemas']['PatchedUserRatingRequest']

export type RatingsListQuery =
	paths['/api/ratings/ratings/']['get'] extends { parameters: { query?: infer Q } } ? Q : Record<string, never>
