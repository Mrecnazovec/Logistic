import { useCreateLoad } from '@/hooks/queries/loads/useCreateLoad'
import { CargoPublishRequestDto } from '@/shared/types/CargoPublish.interface'
import { SubmitHandler, useForm } from 'react-hook-form'

export function usePostForm() {
	const { createLoad, isLoadingCreate } = useCreateLoad()

	const form = useForm<CargoPublishRequestDto>({
		mode: 'onChange',
		defaultValues: {
			is_hidden: false,
			payment_method: 'transfer',
		},
	})

	const onSubmit: SubmitHandler<CargoPublishRequestDto> = (data) => {
		createLoad({ ...data, payment_method: data.payment_method ?? 'transfer' })
		// console.log(data)
	}

	return { onSubmit, form, isLoadingCreate }
}
