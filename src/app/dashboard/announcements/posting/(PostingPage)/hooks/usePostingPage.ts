import { useGetMe } from '@/hooks/queries/me/useGetMe'
import { usePostForm } from './usePostForm'
import { shouldDisableEmailContact } from '../guards/contactGuard'

export function usePostingPage() {
	const { me } = useGetMe()
	const { form, isLoadingCreate, onSubmit } = usePostForm()
	const originCountryValue = form.watch('origin_country')
	const destinationCountryValue = form.watch('destination_country')
	const disableEmailContact = shouldDisableEmailContact(me?.email)

	return {
		form,
		isLoadingCreate,
		onSubmit,
		originCountryValue,
		destinationCountryValue,
		disableEmailContact,
	}
}
