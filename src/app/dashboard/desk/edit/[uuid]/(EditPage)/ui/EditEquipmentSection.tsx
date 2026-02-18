'use client'

import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form-control/Form'
import { InputGroup, InputGroupInput } from '@/components/ui/form-control/InputGroup'
import { TransportSelector } from '@/components/ui/selectors/TransportSelector'
import { useI18n } from '@/i18n/I18nProvider'
import { handleNumericInput } from '@/lib/InputValidation'
import { NUMERIC_REGEX, PRODUCT_MAX_LENGTH } from '@/shared/regex/regex'
import dynamic from 'next/dynamic'
import { EDIT_SECTION_CLASS } from '../constants/editLayout'
import type { EditSectionCommonProps } from '../types/EditForm.types'

const RichTextEditor = dynamic(() =>
	import('@/components/ui/form-control/RichEditor/RichTextEditor').then((m) => m.RichTextEditor),
)

export function EditEquipmentSection({ form, isLoadingPatch }: EditSectionCommonProps) {
	const { t } = useI18n()

	return (
		<div className={EDIT_SECTION_CLASS}>
			<p className='text-xl font-bold text-brand'>{t('desk.edit.equipment.title')}</p>

			<FormField
				control={form.control}
				name='product'
				rules={{
					required: t('desk.edit.equipment.productRequired'),
					maxLength: {
						value: PRODUCT_MAX_LENGTH,
						message: t('desk.edit.equipment.productMax'),
					},
				}}
				render={({ field }) => (
					<FormItem className='w-full'>
						<FormControl>
							<InputGroup>
								<InputGroupInput
									placeholder={t('desk.edit.equipment.productPlaceholder')}
									{...field}
									value={field.value ?? ''}
									maxLength={PRODUCT_MAX_LENGTH}
									className='pl-4'
									disabled={isLoadingPatch}
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
				rules={{ required: t('desk.edit.equipment.transportRequired') }}
				render={({ field }) => (
					<FormItem>
						<FormControl>
							<TransportSelector onChange={field.onChange} value={field.value} disabled={isLoadingPatch} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name='weight_tons'
				rules={{
					required: t('desk.edit.equipment.weightRequired'),
					pattern: {
						value: NUMERIC_REGEX,
						message: t('desk.edit.equipment.weightNumber'),
					},
				}}
				render={({ field }) => (
					<FormItem className='w-full'>
						<FormControl>
							<InputGroup>
								<InputGroupInput
									placeholder={t('desk.edit.equipment.weightPlaceholder')}
									{...field}
									value={field.value ?? ''}
									onChange={(event) => handleNumericInput(event, NUMERIC_REGEX, field.onChange)}
									inputMode='decimal'
									className='pl-4'
									disabled={isLoadingPatch}
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
							<RichTextEditor value={field.value || ''} onChange={(value) => field.onChange(value)} />
						</FormControl>
					</FormItem>
				)}
			/>
		</div>
	)
}

