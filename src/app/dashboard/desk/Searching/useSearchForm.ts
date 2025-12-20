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

	const defaultValues = useMemo(
		() => buildSearchDefaultValues(searchParams),
		[searchParams],
	)

	const form = useForm<ISearch>({
		mode: 'onChange',
		defaultValues,
	})

	useEffect(() => {
		form.reset(defaultValues)
	}, [defaultValues, form])

	const onSubmit: SubmitHandler<ISearch> = async (params) => {
		const cleanParams = Object.fromEntries(
			Object.entries(params)
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

		router.push(`${DASHBOARD_URL.desk()}?${queryString}`, {
			scroll: false,
		})

		await queryClient.invalidateQueries({
			queryKey: ['get loads', 'public'],
		})
	}

	return { form, onSubmit }
}
