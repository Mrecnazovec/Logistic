import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form-control/Form'
import { InputGroup, InputGroupInput } from '@/components/ui/form-control/InputGroup'
import { TransportSelector } from '@/components/ui/selectors/TransportSelector'
import { useI18n } from '@/i18n/I18nProvider'
import { handleNumericInput } from '@/lib/InputValidation'
import { NUMERIC_REGEX, PRODUCT_MAX_LENGTH } from '@/shared/regex/regex'
import { CargoPublishRequestDto } from '@/shared/types/CargoPublish.interface'
import dynamic from 'next/dynamic'
import { UseFormReturn } from 'react-hook-form'
import { POSTING_SECTION_CLASS } from '../constants/postingLayout'

const RichTextEditor = dynamic(() =>
	import('@/components/ui/form-control/RichEditor/RichTextEditor').then((m) => m.RichTextEditor),
)

type EquipmentSectionProps = {
	form: UseFormReturn<CargoPublishRequestDto>
	isLoadingCreate: boolean
}

export function EquipmentSection({ form, isLoadingCreate }: EquipmentSectionProps) {
	const { t } = useI18n()

	return (
		<div className={POSTING_SECTION_CLASS}>
			<p className='text-xl font-bold text-brand'>{t('announcements.posting.equipment.title')}</p>

			<FormField
				control={form.control}
				name='product'
				rules={{
					required: t('announcements.posting.equipment.productRequired'),
					maxLength: {
						value: PRODUCT_MAX_LENGTH,
						message: t('announcements.posting.equipment.productMax'),
					},
				}}
				render={({ field }) => (
					<FormItem className='w-full'>
						<FormControl>
							<InputGroup>
								<InputGroupInput
									placeholder={t('announcements.posting.equipment.productPlaceholder')}
									{...field}
									value={field.value ?? ''}
									maxLength={PRODUCT_MAX_LENGTH}
									className='pl-4'
									disabled={isLoadingCreate}
								/>
							</InputGroup>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name='transport_type'
				rules={{ required: t('announcements.posting.equipment.transportRequired') }}
				render={({ field }) => (
					<FormItem>
						<FormControl>
							<TransportSelector onChange={field.onChange} value={field.value} disabled={isLoadingCreate} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name='weight_tons'
				rules={{
					required: t('announcements.posting.equipment.weightRequired'),
					pattern: {
						value: NUMERIC_REGEX,
						message: t('announcements.posting.equipment.weightNumber'),
					},
				}}
				render={({ field }) => (
					<FormItem className='w-full'>
						<FormControl>
							<InputGroup>
								<InputGroupInput
									placeholder={t('announcements.posting.equipment.weightPlaceholder')}
									{...field}
									value={field.value ?? ''}
									onChange={(event) => handleNumericInput(event, NUMERIC_REGEX, field.onChange)}
									inputMode='decimal'
									className='pl-4'
									disabled={isLoadingCreate}
								/>
							</InputGroup>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name='description'
				render={({ field }) => (
					<FormItem className='w-full max-w-full min-w-0'>
						<FormControl>
							<RichTextEditor
								value={field.value || ''}
								onChange={(value) => field.onChange(value)}
								placeholder={t('announcements.posting.equipment.descriptionPlaceholder')}
							/>
						</FormControl>
					</FormItem>
				)}
			/>
		</div>
	)
}
