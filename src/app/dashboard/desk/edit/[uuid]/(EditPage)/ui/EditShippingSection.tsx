'use client'

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form-control/Form'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/form-control/InputGroup'
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { ContactSelector } from '@/components/ui/selectors/ContactSelector'
import { PaymentSelector } from '@/components/ui/selectors/PaymentSelector'
import { useI18n } from '@/i18n/I18nProvider'
import { handleNumericInput, handlePriceInput } from '@/lib/InputValidation'
import { cn } from '@/lib/utils'
import { PriceSelector } from '@/shared/enums/PriceCurrency.enum'
import { NUMERIC_REGEX, PRICE_FORMAT_REGEX } from '@/shared/regex/regex'
import { Banknote } from 'lucide-react'
import { EDIT_SECTION_CLASS } from '../constants/editLayout'
import type { EditSectionCommonProps } from '../types/EditForm.types'

const AXLES_OPTIONS = ['-', '3', '4', '5', '6', '7', '8', '9', '10'] as const
const CURRENCY_OPTIONS = ['-', ...PriceSelector.map((item) => item.type)] as const
const DASH_LABEL = '—'

type EditShippingSectionProps = EditSectionCommonProps & {
	disableEmailContact: boolean
}

export function EditShippingSection({ form, isLoadingPatch, disableEmailContact }: EditShippingSectionProps) {
	const { t } = useI18n()

	return (
		<div className={`${EDIT_SECTION_CLASS} h-full`}>
			<p className='text-xl font-bold text-brand'>{t('desk.edit.shipping.title')}</p>

			<div className='flex items-end gap-6'>
				<FormField
					control={form.control}
					name='price_currency'
					render={({ field }) => (
						<FormItem className='w-1/2'>
							<FormLabel className='text-brand'>{t('desk.edit.shipping.currencyLabel')}</FormLabel>
							<FormControl>
								<Select
									value={field.value === null || field.value === undefined ? '-' : String(field.value)}
									onValueChange={(value) => field.onChange(value === '-' ? null : value)}
									disabled={isLoadingPatch}
								>
									<SelectTrigger
										className={cn(
											'w-full rounded-full bg-grayscale-50 border-none px-4 h-14 shadow-none',
											field.value === null || field.value === undefined ? 'text-grayscale' : 'text-black',
										)}
									>
										<SelectValue placeholder={t('desk.edit.shipping.currencyLabel')} />
									</SelectTrigger>
									<SelectContent>
										{CURRENCY_OPTIONS.map((option) => (
											<SelectItem key={option} value={option}>
												{option === '-' ? DASH_LABEL : t(PriceSelector.find((item) => item.type === option)?.nameKey ?? option)}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='price_value'
					rules={{
						validate: (value) => !value || PRICE_FORMAT_REGEX.test(String(value)),
					}}
					render={({ field }) => (
						<FormItem className='w-1/2'>
							<FormControl>
								<InputGroup>
									<InputGroupInput
										placeholder={t('desk.edit.shipping.pricePlaceholder')}
										{...field}
										value={field.value ?? ''}
										onChange={(event) => handlePriceInput(event, field.onChange)}
										inputMode='numeric'
										type='text'
										disabled={isLoadingPatch}
									/>
									<InputGroupAddon className='pr-2'>
										<Banknote className={cn('text-grayscale size-5', field.value && 'text-black')} />
									</InputGroupAddon>
								</InputGroup>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			<div className='flex items-end gap-6'>
				<FormField
					control={form.control}
					name='volume_m3'
					rules={{ required: t('desk.edit.shipping.dimensionsRequired') }}
					render={({ field }) => (
						<FormItem className='w-1/2'>
							<FormLabel className='text-brand'>{t('desk.edit.shipping.dimensionsLabel')}</FormLabel>
							<FormControl>
								<InputGroup>
									<InputGroupInput
										placeholder={t('desk.edit.shipping.dimensionsPlaceholder')}
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
					name='axles'
					render={({ field }) => (
						<FormItem className='w-1/2'>
							<FormLabel className='text-brand'>{t('desk.edit.shipping.axlesPlaceholder')}</FormLabel>
							<FormControl>
								<Select
									value={field.value === null || field.value === undefined ? '-' : String(field.value)}
									onValueChange={(value) => field.onChange(value === '-' ? null : Number(value))}
									disabled={isLoadingPatch}
								>
									<SelectTrigger
										className={cn(
											'w-full rounded-full bg-grayscale-50 border-none px-4 h-14 shadow-none',
											field.value === null || field.value === undefined ? 'text-grayscale' : 'text-black',
										)}
									>
										<SelectValue placeholder={t('desk.edit.shipping.axlesPlaceholder')} />
									</SelectTrigger>
									<SelectContent>
										{AXLES_OPTIONS.map((option) => (
											<SelectItem key={option} value={option}>
												{option === '-' ? DASH_LABEL : option}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			<FormField
				control={form.control}
				name='contact_pref'
				rules={{ required: t('desk.edit.shipping.contactRequired') }}
				render={({ field }) => (
					<FormItem className='mb-6'>
						<FormControl>
							<ContactSelector
								onChange={field.onChange}
								disabled={isLoadingPatch}
								value={field.value}
								disableEmailOptions={disableEmailContact}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name='payment_method'
				rules={{ required: t('desk.edit.shipping.paymentRequired') }}
				render={({ field }) => (
					<FormItem className='mb-6'>
						<FormLabel className='text-brand'>{t('desk.edit.shipping.paymentLabel')}</FormLabel>
						<FormControl>
							<PaymentSelector onChange={field.onChange} value={field.value} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name='is_hidden'
				render={({ field }) => (
					<FormItem className='mb-6'>
						<FormLabel className='text-brand mb-3'>{t('desk.edit.shipping.visibilityLabel')}</FormLabel>
						<FormControl>
							<RadioGroup
								onValueChange={(value) => field.onChange(value === 'true')}
								value={(field.value ?? false) ? 'true' : 'false'}
								className='space-y-3'
							>
								<FormItem className='flex items-center gap-3'>
									<FormControl>
										<RadioGroupItem value='false' disabled={isLoadingPatch} />
									</FormControl>
									<FormLabel className='m-0 font-semibold'>{t('desk.edit.shipping.visible')}</FormLabel>
								</FormItem>
								<FormItem className='flex items-center gap-3'>
									<FormControl>
										<RadioGroupItem value='true' disabled={isLoadingPatch} />
									</FormControl>
									<FormLabel className='m-0 font-semibold'>{t('desk.edit.shipping.hidden')}</FormLabel>
								</FormItem>
							</RadioGroup>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	)
}
