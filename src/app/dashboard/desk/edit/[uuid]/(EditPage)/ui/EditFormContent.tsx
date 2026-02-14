"use client"

import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Button } from '@/components/ui/Button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/Dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form-control/Form'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/form-control/InputGroup'
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup'
import { CitySelector } from '@/components/ui/selectors/CitySelector'
import { ContactSelector } from '@/components/ui/selectors/ContactSelector'
import { CurrencySelector } from '@/components/ui/selectors/CurrencySelector'
import { DatePicker } from '@/components/ui/selectors/DateSelector'
import { PaymentSelector } from '@/components/ui/selectors/PaymentSelector'
import { TransportSelector } from '@/components/ui/selectors/TransportSelector'
import { LocationMapPicker } from '@/app/dashboard/announcements/posting/(PostingPage)/ui/LocationMapPicker'
import { useI18n } from '@/i18n/I18nProvider'
import { handleNumericInput } from '@/lib/InputValidation'
import { cn } from '@/lib/utils'
import { NUMERIC_REGEX, PRODUCT_MAX_LENGTH } from '@/shared/regex/regex'
import { CityCoordinates } from '@/shared/types/Nominatim.interface'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Banknote, Home } from 'lucide-react'
import { EDIT_SECTION_CLASS } from '../constants/editLayout'

const RichTextEditor = dynamic(() =>
	import('@/components/ui/form-control/RichEditor/RichTextEditor').then((m) => m.RichTextEditor),
)

type Props = {
	form: any
	onSubmit: (data: any) => void
	isLoadingPatch: boolean
	load: any
	me: any
	originCountryValue?: string
	destinationCountryValue?: string
	originCityLabel?: string
	destinationCityLabel?: string
	yandexApiKey?: string
	showMap?: boolean
}

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
}: Props) {
	const { t } = useI18n()
	const router = useRouter()
	const [originCityCoordinates, setOriginCityCoordinates] = useState<CityCoordinates | null>(null)
	const [destinationCityCoordinates, setDestinationCityCoordinates] = useState<CityCoordinates | null>(null)
	const [originExactCoordinates, setOriginExactCoordinates] = useState<{ lat: number; lng: number } | null>(null)
	const [destinationExactCoordinates, setDestinationExactCoordinates] = useState<{ lat: number; lng: number } | null>(null)
	const originCity = form.watch('origin_city')
	const originAddress = form.watch('origin_address')
	const destinationCity = form.watch('destination_city')
	const destinationAddress = form.watch('destination_address')

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className='grid lg:grid-cols-2 gap-x-6 gap-y-4'>
					<div className={EDIT_SECTION_CLASS}>
						<FormField
							control={form.control}
							name='origin_city'
							rules={{ required: t('desk.edit.origin.cityRequired') }}
							render={({ field }) => (
								<FormItem className='w-full'>
									<FormLabel className='flex flex-wrap items-center justify-between mb-6'>
										<p className='text-brand font-bold text-xl'>{t('desk.edit.origin.title')}</p>
										<UuidCopy uuid={load?.uuid} isPlaceholder />
									</FormLabel>
									<FormControl>
										<CitySelector
											value={field.value || ''}
											displayValue={originCityLabel}
											countryName={originCountryValue}
											onChange={(val, city) => {
												field.onChange(val)
												form.setValue('origin_country', city?.country ?? '')
												form.setValue('origin_address', '', { shouldDirty: true, shouldTouch: true })
												setOriginExactCoordinates(null)
											}}
											onCoordinates={(coordinates) => {
												setOriginCityCoordinates(coordinates)
											}}
											countryCode={undefined}
											placeholder={t('desk.edit.origin.cityPlaceholder')}
											disabled={isLoadingPatch}
										/>
									</FormControl>
									{showMap ? (
										<LocationMapPicker
											type='origin'
											apiKey={yandexApiKey}
											city={originCity}
											country={originCountryValue}
											address={originAddress}
											fallbackPoint={
												originCityCoordinates
													? {
															lat: Number(originCityCoordinates.lat),
															lng: Number(originCityCoordinates.lon),
														}
													: null
											}
											value={originExactCoordinates}
											onSelect={(selection) => {
												setOriginExactCoordinates({ lat: selection.lat, lng: selection.lng })
												if (selection.address) {
													form.setValue('origin_address', selection.address, { shouldDirty: true, shouldTouch: true })
												}
											}}
											disabled={isLoadingPatch}
										/>
									) : null}
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='origin_address'
							rules={{ required: t('desk.edit.origin.addressRequired') }}
							render={({ field }) => (
								<FormItem className='w-full'>
									<FormControl>
										<InputGroup>
											<InputGroupInput
												placeholder={t('desk.edit.origin.addressPlaceholder')}
												{...field}
												value={field.value ?? ''}
												disabled={isLoadingPatch || showMap}
											/>
											<InputGroupAddon className='pr-2'>
												<Home className={cn('text-grayscale size-5', field.value && 'text-black')} />
											</InputGroupAddon>
										</InputGroup>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='load_date'
							rules={{ required: t('desk.edit.origin.dateRequired') }}
							render={({ field }) => (
								<FormItem className='flex flex-col'>
									<FormControl>
										<DatePicker
											value={field.value}
											onChange={field.onChange}
											placeholder={t('desk.edit.origin.datePlaceholder')}
											disabled={isLoadingPatch}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className={EDIT_SECTION_CLASS}>
						<FormField
							control={form.control}
							name='destination_city'
							rules={{ required: t('desk.edit.destination.cityRequired') }}
							render={({ field }) => (
								<FormItem className='w-full'>
									<FormLabel className='text-brand mb-6 font-bold text-xl'>{t('desk.edit.destination.title')}</FormLabel>
									<FormControl>
										<CitySelector
											value={field.value || ''}
											displayValue={destinationCityLabel}
											countryName={destinationCountryValue}
											onChange={(val, city) => {
												field.onChange(val)
												form.setValue('destination_country', city?.country ?? '')
												form.setValue('destination_address', '', { shouldDirty: true, shouldTouch: true })
												setDestinationExactCoordinates(null)
											}}
											onCoordinates={(coordinates) => {
												setDestinationCityCoordinates(coordinates)
											}}
											countryCode={undefined}
											placeholder={t('desk.edit.destination.cityPlaceholder')}
											disabled={isLoadingPatch}
										/>
									</FormControl>
									{showMap ? (
										<LocationMapPicker
											type='destination'
											apiKey={yandexApiKey}
											city={destinationCity}
											country={destinationCountryValue}
											address={destinationAddress}
											fallbackPoint={
												destinationCityCoordinates
													? {
															lat: Number(destinationCityCoordinates.lat),
															lng: Number(destinationCityCoordinates.lon),
														}
													: null
											}
											value={destinationExactCoordinates}
											onSelect={(selection) => {
												setDestinationExactCoordinates({ lat: selection.lat, lng: selection.lng })
												if (selection.address) {
													form.setValue('destination_address', selection.address, { shouldDirty: true, shouldTouch: true })
												}
											}}
											disabled={isLoadingPatch}
										/>
									) : null}
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='destination_address'
							rules={{ required: t('desk.edit.destination.addressRequired') }}
							render={({ field }) => (
								<FormItem className='w-full'>
									<FormControl>
										<InputGroup>
											<InputGroupInput
												placeholder={t('desk.edit.destination.addressPlaceholder')}
												{...field}
												value={field.value ?? ''}
												disabled={isLoadingPatch || showMap}
											/>
											<InputGroupAddon className='pr-2'>
												<Home className={cn('text-grayscale size-5', field.value && 'text-black')} />
											</InputGroupAddon>
										</InputGroup>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='delivery_date'
							rules={{ required: t('desk.edit.destination.dateRequired') }}
							render={({ field }) => (
								<FormItem className='flex flex-col'>
									<FormControl>
										<DatePicker
											value={field.value ?? undefined}
											onChange={field.onChange}
											placeholder={t('desk.edit.destination.datePlaceholder')}
											disabled={isLoadingPatch}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className={`${EDIT_SECTION_CLASS} h-full`}>
						<p className='text-xl font-bold text-brand'>{t('desk.edit.shipping.title')}</p>
						<div className='flex items-end gap-6'>
							<FormField
								control={form.control}
								name='price_currency'
								rules={{ required: t('desk.edit.shipping.currencyRequired') }}
								render={({ field }) => (
									<FormItem className='w-1/2'>
										<FormLabel className='text-brand'>{t('desk.edit.shipping.currencyLabel')}</FormLabel>
										<FormControl>
											<CurrencySelector onChange={field.onChange} disabled={isLoadingPatch} value={field.value} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='price_value'
								rules={{ required: t('desk.edit.shipping.priceRequired') }}
								render={({ field }) => (
									<FormItem className='w-1/2'>
										<FormControl>
											<InputGroup>
												<InputGroupInput
													placeholder={t('desk.edit.shipping.pricePlaceholder')}
													{...field}
													value={field.value ?? ''}
													onChange={(event) => handleNumericInput(event, NUMERIC_REGEX, field.onChange)}
													inputMode='decimal'
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
										<FormControl>
											<InputGroup>
												<InputGroupInput
													placeholder={t('desk.edit.shipping.axlesPlaceholder')}
													{...field}
													value={field.value ?? ''}
													onChange={(event) =>
														handleNumericInput(event, NUMERIC_REGEX, (value) => {
															const numericValue = Number(value)
															if (value !== '' && Number.isFinite(numericValue) && numericValue > 10) {
																field.onChange('10')
																return
															}
															field.onChange(value)
														})
													}
													inputMode='decimal'
													max={10}
													className='pl-4'
													disabled={isLoadingPatch}
												/>
											</InputGroup>
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
											disableEmailOptions={!me?.email}
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
				</div>

				<div className='mt-4 flex items-center sm:justify-end justify-center gap-4'>
					<Dialog>
						<DialogTrigger asChild>
							<Button variant='outline'>{t('desk.edit.actions.cancel')}</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogTitle>{t('desk.edit.cancel.title')}</DialogTitle>
							<DialogDescription>{t('desk.edit.cancel.description')}</DialogDescription>
							<DialogFooter>
								<DialogClose asChild>
									<Button variant='outline'>{t('desk.edit.cancel.close')}</Button>
								</DialogClose>
								<DialogClose asChild>
									<Button onClick={() => router.back()}>{t('desk.edit.cancel.back')}</Button>
								</DialogClose>
							</DialogFooter>
						</DialogContent>
					</Dialog>
					<Button type='submit'>{t('desk.edit.actions.submit')}</Button>
				</div>
			</form>
		</Form>
	)
}
