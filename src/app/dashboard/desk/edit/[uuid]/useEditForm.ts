import { usePatchLoad } from '@/hooks/queries/loads/usePatchLoad'
import { ICargoPublish } from '@/shared/types/CargoPublish.interface'
import { useParams } from 'next/navigation'
import { SubmitHandler, useForm } from 'react-hook-form'

export function useEditForm() {
	const { patchLoad, isLoadingPatch } = usePatchLoad()
	const param = useParams<{ uuid: string }>()

	const form = useForm<ICargoPublish>({
		mode: 'onChange',
		defaultValues: { is_hidden: false },
	})

	const onSubmit: SubmitHandler<ICargoPublish> = (data) => {
		patchLoad({ uuid: param.uuid, data })
		// console.log(data)
	}

	return { onSubmit, form, isLoadingPatch }
}
