import { DASHBOARD_URL } from '@/config/url.config'
import { usePatchLoad } from '@/hooks/queries/loads/usePatchLoad'
import { CargoPublishRequestDto } from '@/shared/types/CargoPublish.interface'
import { useParams, useRouter } from 'next/navigation'
import { SubmitHandler, useForm } from 'react-hook-form'

export function useEditForm() {
	const { patchLoad, isLoadingPatch } = usePatchLoad()
	const param = useParams<{ uuid: string }>()
	const router = useRouter()

	const form = useForm<CargoPublishRequestDto>({
		mode: 'onChange',
		defaultValues: {
			is_hidden: false,
		},
	})

	const onSubmit: SubmitHandler<CargoPublishRequestDto> = (data) => {
		const rawAxles = data.axles as number | string | null | undefined
		const rawPriceValue = data.price_value as string | null | undefined
		const rawPriceCurrency = data.price_currency as string | null | undefined
		const normalizedAxles = rawAxles === null || rawAxles === undefined || rawAxles === '' ? null : Number(rawAxles)
		const normalizedPriceValue = rawPriceValue === '' || rawPriceValue === undefined ? null : rawPriceValue
		const normalizedPriceCurrency = rawPriceCurrency === '' || rawPriceCurrency === undefined ? null : rawPriceCurrency

		patchLoad({
			uuid: param.uuid,
			data: {
				...data,
				axles: Number.isFinite(normalizedAxles) ? normalizedAxles : null,
				price_value: normalizedPriceValue,
				price_currency: normalizedPriceCurrency as CargoPublishRequestDto['price_currency'],
				is_hidden: data.is_hidden ?? false,
			},
		})

		router.push(DASHBOARD_URL.desk())
	}

	return { onSubmit, form, isLoadingPatch }
}
