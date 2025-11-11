import { useParams, useRouter } from 'next/navigation'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import { DASHBOARD_URL } from '@/config/url.config'
import { ISearch } from '@/shared/types/Search.interface'

export function useSearchForm() {
	const router = useRouter()
	const queryClient = useQueryClient()
	const param = useParams<{ role: string }>()

	const form = useForm<ISearch>({
		mode: 'onChange',
	})

	const onSubmit: SubmitHandler<ISearch> = async (params) => {
		const cleanParams: Record<string, string> = {}

		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined && value !== null && value !== '' && !(typeof value === 'object' && Object.keys(value).length === 0)) {
				cleanParams[key] = String(value)
			}
		})

		const queryString = new URLSearchParams(cleanParams).toString()

		form.reset()

		router.push(`${DASHBOARD_URL.rating(param.role)}?${queryString}`, {
			scroll: false,
		})

		await queryClient.invalidateQueries({
			queryKey: ['get ratings'],
		})
	}

	return { form, onSubmit }
}
