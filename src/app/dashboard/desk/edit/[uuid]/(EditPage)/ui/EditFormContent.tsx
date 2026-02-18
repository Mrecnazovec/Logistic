'use client'

import { Form } from '@/components/ui/form-control/Form'
import { useEditFormMapState } from '../hooks/useEditFormMapState'
import type { EditFormContentProps } from '../types/EditForm.types'
import { EditDestinationSection } from './EditDestinationSection'
import { EditEquipmentSection } from './EditEquipmentSection'
import { EditFormActions } from './EditFormActions'
import { EditOriginSection } from './EditOriginSection'
import { EditShippingSection } from './EditShippingSection'

export function EditFormContent({
	form,
	onSubmit,
	isLoadingPatch,
	load,
	me,
	originCountryValue,
	destinationCountryValue,
	originCityLabel,
	destinationCityLabel,
	yandexApiKey,
	showMap = true,
}: EditFormContentProps) {
	const mapState = useEditFormMapState(form)

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className='grid lg:grid-cols-2 gap-x-6 gap-y-4'>
					<EditOriginSection
						form={form}
						isLoadingPatch={isLoadingPatch}
						loadUuid={load?.uuid}
						originCountryValue={originCountryValue}
						originCityLabel={originCityLabel}
						yandexApiKey={yandexApiKey}
						showMap={showMap}
						mapState={mapState}
					/>
					<EditDestinationSection
						form={form}
						isLoadingPatch={isLoadingPatch}
						destinationCountryValue={destinationCountryValue}
						destinationCityLabel={destinationCityLabel}
						yandexApiKey={yandexApiKey}
						showMap={showMap}
						mapState={mapState}
					/>
					<EditShippingSection
						form={form}
						isLoadingPatch={isLoadingPatch}
						disableEmailContact={!me?.email}
					/>
					<EditEquipmentSection form={form} isLoadingPatch={isLoadingPatch} />
				</div>
				<EditFormActions />
			</form>
		</Form>
	)
}

