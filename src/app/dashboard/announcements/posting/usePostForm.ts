import { useCreateLoad } from '@/hooks/queries/loads/useCreateLoad'
import { CargoPublishRequestDto } from '@/shared/types/CargoPublish.interface'
import { SubmitHandler, useForm } from 'react-hook-form'

export function usePostForm() {
	const { createLoad, isLoadingCreate } = useCreateLoad()

	const form = useForm<CargoPublishRequestDto>({
		mode: 'onChange',
	})

	const onSubmit: SubmitHandler<CargoPublishRequestDto> = (data) => {
		const weightTons = Number(data.weight_tons ?? 0)
		const weight_kg = (Number.isFinite(weightTons) ? weightTons * 1000 : 0).toString()

		createLoad({
			...data,
			weight_kg,
			payment_method: data.payment_method ?? 'transfer',
		})
	}

	return { onSubmit, form, isLoadingCreate }
}
