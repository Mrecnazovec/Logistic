'use client'

import { Form } from '@/components/ui/form-control/Form'
import { DestinationSection } from './ui/DestinationSection'
import { EquipmentSection } from './ui/EquipmentSection'
import { OriginSection } from './ui/OriginSection'
import { PostingActions } from './ui/PostingActions'
import { ShippingSection } from './ui/ShippingSection'
import { usePostingPage } from './hooks/usePostingPage'

export function PostingPage() {
	const { form, isLoadingCreate, onSubmit, originCountryValue, destinationCountryValue, disableEmailContact } =
		usePostingPage()

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className='grid lg:grid-cols-2 gap-x-6 gap-y-4'>
					<OriginSection form={form} isLoadingCreate={isLoadingCreate} originCountryValue={originCountryValue} />
					<DestinationSection
						form={form}
						isLoadingCreate={isLoadingCreate}
						destinationCountryValue={destinationCountryValue}
					/>
					<ShippingSection
						form={form}
						isLoadingCreate={isLoadingCreate}
						disableEmailContact={disableEmailContact}
					/>
					<EquipmentSection form={form} isLoadingCreate={isLoadingCreate} />
				</div>
				<PostingActions form={form} isLoadingCreate={isLoadingCreate} />
			</form>
		</Form>
	)
}
