import { useCreateLoad } from '@/hooks/queries/loads/useCreateLoad'
import { ICargoPublish } from '@/shared/types/CargoPublish.interface'
import { SubmitHandler, useForm } from 'react-hook-form'

export function usePostForm() {
	const { createLoad, isLoadingCreate } = useCreateLoad()

	const form = useForm<ICargoPublish>({
		mode: 'onChange',
		defaultValues: {
			is_hidden: false,
		},
	})

	const onSubmit: SubmitHandler<ICargoPublish> = (data) => {
		// createLoad(data)
		console.log(data);
		
	}

	return { onSubmit, form, isLoadingCreate }
}
