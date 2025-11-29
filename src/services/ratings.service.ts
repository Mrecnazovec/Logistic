import { axiosWithAuth } from '@/api/api.interceptors'
import { API_URL } from '@/config/api.config'
import { IPaginatedUserRatingList } from '@/shared/types/PaginatedList.interface'
import { IUserRating, PatchedUserRatingRequestDto, RatingsListQuery, UserRatingRequestDto } from '@/shared/types/Rating.interface'

export type { RatingsListQuery } from '@/shared/types/Rating.interface'

class RatingsService {
	/* GET */

	async getRatings(params?: RatingsListQuery) {
		const { data } = await axiosWithAuth<IPaginatedUserRatingList>({
			url: API_URL.ratings('rating-users/countries/'),
			method: 'GET',
			params,
		})

		return data
	}

	/* POST */

	async createRating(data: UserRatingRequestDto) {
		const { data: createdRating } = await axiosWithAuth<IUserRating>({
			url: API_URL.ratings('ratings/'),
			method: 'POST',
			data,
		})

		return createdRating
	}

	/* PUT */

	async putRating(id: string | number, data: UserRatingRequestDto) {
		const { data: updatedRating } = await axiosWithAuth<IUserRating>({
			url: API_URL.ratings(`${id}`),
			method: 'PUT',
			data,
		})

		return updatedRating
	}

	/* PATCH */

	async patchRating(id: string | number, data: PatchedUserRatingRequestDto) {
		const { data: patchedRating } = await axiosWithAuth<IUserRating>({
			url: API_URL.ratings(`${id}`),
			method: 'PATCH',
			data,
		})

		return patchedRating
	}

	/* DELETE */

	async deleteRating(id: string | number) {
		return axiosWithAuth<void>({
			url: API_URL.ratings(`${id}`),
			method: 'DELETE',
		})
	}
}

export const ratingsService = new RatingsService()
