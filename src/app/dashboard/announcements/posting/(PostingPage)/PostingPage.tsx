'use client'

import { Form } from '@/components/ui/form-control/Form'
import { DestinationSection } from './ui/DestinationSection'
import { EquipmentSection } from './ui/EquipmentSection'
import { OriginSection } from './ui/OriginSection'
import { PostingActions } from './ui/PostingActions'
import { ShippingSection } from './ui/ShippingSection'
import { usePostingPage } from './hooks/usePostingPage'

type PostingPageProps = {
	yandexApiKey?: string
	showMap?: boolean
}

type PostingPageVariantProps = {
	yandexApiKey?: string
}

export function PostingPage({ yandexApiKey, showMap = true }: PostingPageProps) {
	const { form, isLoadingCreate, onSubmit, originCountryValue, destinationCountryValue, disableEmailContact } =
		usePostingPage()

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className='grid lg:grid-cols-2 gap-x-6 gap-y-4'>
					<OriginSection
						form={form}
						isLoadingCreate={isLoadingCreate}
						originCountryValue={originCountryValue}
						yandexApiKey={yandexApiKey}
						showMap={showMap}
					/>
					<DestinationSection
						form={form}
						isLoadingCreate={isLoadingCreate}
						destinationCountryValue={destinationCountryValue}
						yandexApiKey={yandexApiKey}
						showMap={showMap}
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

export function PostingPageWithMap({ yandexApiKey }: PostingPageVariantProps) {
	return <PostingPage yandexApiKey={yandexApiKey} showMap />
}

export function PostingPageWithoutMap({ yandexApiKey }: PostingPageVariantProps) {
	return <PostingPage yandexApiKey={yandexApiKey} showMap={false} />
}
