import { useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import { DASHBOARD_URL } from '@/config/url.config'
import { buildSearchDefaultValues } from '@/lib/search/buildSearchDefaultValues'
import { ISearch } from '@/shared/types/Search.interface'

export function useSearchForm() {
	const router = useRouter()
	const queryClient = useQueryClient()
	const searchParams = useSearchParams()
	const searchParamsString = searchParams.toString()

	const defaultValues = useMemo(
		() => buildSearchDefaultValues(new URLSearchParams(searchParamsString)),
		[searchParamsString],
	)

	const form = useForm<ISearch>({
		mode: 'onChange',
		defaultValues,
	})

	useEffect(() => {
		form.reset(defaultValues)
	}, [defaultValues, form])

	const onSubmit: SubmitHandler<ISearch> = (params) => {
		const normalizedParams: Record<string, unknown> = { ...params }
		const hasCurrency = Boolean(normalizedParams.price_currency)
		const hasMinPrice = normalizedParams.min_price !== undefined && normalizedParams.min_price !== null && normalizedParams.min_price !== ''
		const hasMaxPrice = normalizedParams.max_price !== undefined && normalizedParams.max_price !== null && normalizedParams.max_price !== ''

		if (hasCurrency && !hasMinPrice && !hasMaxPrice) {
			normalizedParams.price_currency_selected = normalizedParams.price_currency
			delete normalizedParams.price_currency
		} else {
			delete normalizedParams.price_currency_selected
		}

		const cleanParams = Object.fromEntries(
			Object.entries(normalizedParams)
				.filter(
					([, value]) =>
						value !== undefined &&
						value !== null &&
						value !== '' &&
						!(typeof value === 'object' && Object.keys(value).length === 0),
				)
				.map(([key, value]) => [key, String(value)]),
		)

		const queryString = new URLSearchParams(cleanParams).toString()

		router.push(`${DASHBOARD_URL.announcements()}?${queryString}`, {
			scroll: false,
		})

		void queryClient.invalidateQueries({
			queryKey: ['get loads', 'public'],
		})
	}

	return { form, onSubmit }
}
