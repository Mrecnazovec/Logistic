import { useCreateLoad } from '@/hooks/queries/loads/useCreateLoad'
import { normalizePriceValueForPayload } from '@/lib/InputValidation'
import { CargoPublishRequestDto } from '@/shared/types/CargoPublish.interface'
import { SubmitHandler, useForm } from 'react-hook-form'

export function usePostForm() {
	const { createLoad, isLoadingCreate } = useCreateLoad()

	const form = useForm<CargoPublishRequestDto>({
		mode: 'onChange',
		defaultValues: {
			is_hidden: false,
		},
	})

	const onSubmit: SubmitHandler<CargoPublishRequestDto> = (data) => {
		const weightTons = Number(data.weight_tons ?? 0)
		const weight_kg = (Number.isFinite(weightTons) ? weightTons * 1000 : 0).toString()
		const rawAxles = data.axles as number | string | null | undefined
		const rawPriceValue = data.price_value as string | null | undefined
		const rawPriceCurrency = data.price_currency as string | null | undefined
		const normalizedAxles = rawAxles === null || rawAxles === undefined || rawAxles === '' ? null : Number(rawAxles)
		const normalizedPriceValue = normalizePriceValueForPayload(rawPriceValue)
		const normalizedPriceCurrency = rawPriceCurrency === '' || rawPriceCurrency === undefined ? null : rawPriceCurrency

		createLoad({
			...data,
			weight_kg,
			axles: Number.isFinite(normalizedAxles) ? normalizedAxles : null,
			price_value: normalizedPriceValue,
			price_currency: normalizedPriceCurrency as CargoPublishRequestDto['price_currency'],
			payment_method: data.payment_method ?? 'both',
			is_hidden: data.is_hidden ?? false,
			origin_lat: data.origin_lat,
			origin_lng: data.origin_lng,
			dest_lat: data.dest_lat,
			dest_lng: data.dest_lng,
		})
	}

	return { onSubmit, form, isLoadingCreate }
}
