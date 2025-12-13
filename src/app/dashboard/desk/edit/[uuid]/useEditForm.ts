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
		const weight_tons = Number(data.weight_kg) ? Number(data.weight_kg) / 1000 : 0

		patchLoad({
			uuid: param.uuid,
			data: {
				...data,
				is_hidden: data.is_hidden ?? false,
			},
		})

		router.push(DASHBOARD_URL.desk())
	}

	return { onSubmit, form, isLoadingPatch }
}
