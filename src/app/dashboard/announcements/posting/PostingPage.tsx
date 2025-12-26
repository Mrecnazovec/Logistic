'use client'

import { Button } from '@/components/ui/Button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/Dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form-control/Form'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/form-control/InputGroup'
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup'
import { CitySelector } from '@/components/ui/selectors/CitySelector'
import { ContactSelector } from '@/components/ui/selectors/ContactSelector'
import { CurrencySelector } from '@/components/ui/selectors/CurrencySelector'
import { DatePicker } from '@/components/ui/selectors/DateSelector'
import { PaymentSelector } from '@/components/ui/selectors/PaymentSelector'
import { TransportSelector } from '@/components/ui/selectors/TransportSelector'
import { useI18n } from '@/i18n/I18nProvider'
import { handleNumericInput } from '@/lib/InputValidation'
import { cn } from '@/lib/utils'
import { NUMERIC_REGEX, PRODUCT_MAX_LENGTH } from '@/shared/regex/regex'
import { Banknote, Home } from 'lucide-react'
import dynamic from 'next/dynamic'
import { usePostForm } from './usePostForm'

const RichTextEditor = dynamic(() =>
	import('@/components/ui/form-control/RichEditor/RichTextEditor').then((m) => m.RichTextEditor),
)

export function PostingPage() {
	const { t } = useI18n()
	const { form, isLoadingCreate, onSubmit } = usePostForm()
	const originCountryValue = form.watch('origin_country')
	const destinationCountryValue = form.watch('destination_country')

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className='grid lg:grid-cols-2 gap-x-6 gap-y-4'>
					<div className='bg-background rounded-4xl sm:p-12 p-4 space-y-4'>
						<FormField
							control={form.control}
							name='origin_city'
							rules={{ required: t('announcements.posting.origin.cityRequired') }}
							render={({ field }) => (
								<FormItem className='w-full'>
									<FormLabel className='text-brand mb-6 font-bold text-xl'>{t('announcements.posting.origin.title')}</FormLabel>
									<FormControl>
										<CitySelector
											value={field.value || ''}
											countryName={originCountryValue}
											onChange={(val, city) => {
												field.onChange(val)
												form.setValue('origin_country', city?.country ?? '')
											}}
											countryCode={undefined}
											placeholder={t('announcements.posting.origin.cityPlaceholder')}
											disabled={isLoadingCreate}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='origin_address'
							rules={{ required: t('announcements.posting.origin.addressRequired') }}
							render={({ field }) => (
								<FormItem className='w-full'>
									<FormControl>
										<InputGroup>
											<InputGroupInput
												placeholder={t('announcements.posting.origin.addressPlaceholder')}
												{...field}
												value={field.value ?? ''}
												disabled={isLoadingCreate}
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
							rules={{ required: t('announcements.posting.origin.dateRequired') }}
							render={({ field }) => (
								<FormItem className='flex flex-col'>
									<FormControl>
										<DatePicker
											value={field.value}
											onChange={field.onChange}
											placeholder={t('announcements.posting.origin.datePlaceholder')}
											disabled={isLoadingCreate}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className='bg-background rounded-4xl sm:p-12 p-4 space-y-4'>
						<FormField
							control={form.control}
							name='destination_city'
							rules={{ required: t('announcements.posting.destination.cityRequired') }}
							render={({ field }) => (
								<FormItem className='w-full'>
									<FormLabel className='text-brand mb-6 font-bold text-xl'>{t('announcements.posting.destination.title')}</FormLabel>
									<FormControl>
										<CitySelector
											value={field.value || ''}
											countryName={destinationCountryValue}
											onChange={(val, city) => {
												field.onChange(val)
												form.setValue('destination_country', city?.country ?? '')
											}}
											countryCode={undefined}
											placeholder={t('announcements.posting.destination.cityPlaceholder')}
											disabled={isLoadingCreate}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='destination_address'
							rules={{ required: t('announcements.posting.destination.addressRequired') }}
							render={({ field }) => (
								<FormItem className='w-full'>
									<FormControl>
										<InputGroup>
											<InputGroupInput
												placeholder={t('announcements.posting.destination.addressPlaceholder')}
												{...field}
												value={field.value ?? ''}
												disabled={isLoadingCreate}
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
							rules={{ required: t('announcements.posting.destination.dateRequired') }}
							render={({ field }) => (
								<FormItem className='flex flex-col'>
									<FormControl>
										<DatePicker
											value={field.value ?? undefined}
											onChange={field.onChange}
											placeholder={t('announcements.posting.destination.datePlaceholder')}
											disabled={isLoadingCreate}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className='bg-background rounded-4xl sm:p-12 p-4 space-y-4 h-full'>
						<p className='text-xl font-bold text-brand'>{t('announcements.posting.shipping.title')}</p>
						<div className='flex items-end gap-6'>
							<FormField
								control={form.control}
								name='price_currency'
								rules={{ required: t('announcements.posting.shipping.currencyRequired') }}
								render={({ field }) => (
									<FormItem className='w-1/2'>
										<FormLabel className='text-brand'>{t('announcements.posting.shipping.currencyLabel')}</FormLabel>
										<FormControl>
											<CurrencySelector onChange={field.onChange} disabled={isLoadingCreate} value={field.value} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='price_value'
								rules={{
									required: t('announcements.posting.shipping.priceRequired'),
								}}
								render={({ field }) => (
									<FormItem className='w-1/2'>
										<FormControl>
											<InputGroup>
												<InputGroupInput
													placeholder={t('announcements.posting.shipping.pricePlaceholder')}
													{...field}
													value={field.value ?? ''}
													onChange={(event) => handleNumericInput(event, NUMERIC_REGEX, field.onChange)}
													inputMode='decimal'
													disabled={isLoadingCreate}
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
								rules={{
									required: t('announcements.posting.shipping.dimensionsRequired'),
								}}
								render={({ field }) => (
									<FormItem className='w-1/2'>
										<FormLabel className='text-brand'>{t('announcements.posting.shipping.dimensionsLabel')}</FormLabel>
										<FormControl>
											<InputGroup>
												<InputGroupInput
													placeholder={t('announcements.posting.shipping.dimensionsPlaceholder')}
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
								name='axles'
								render={({ field }) => (
									<FormItem className='w-1/2'>
										<FormControl>
											<InputGroup>
												<InputGroupInput
													placeholder={t('announcements.posting.shipping.axlesPlaceholder')}
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
													disabled={isLoadingCreate}
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
							rules={{ required: t('announcements.posting.shipping.contactRequired') }}
							render={({ field }) => (
								<FormItem className='mb-6'>
									<FormLabel className='text-brand'>{t('announcements.posting.shipping.contactLabel')}</FormLabel>
									<FormControl>
										<ContactSelector onChange={field.onChange} value={field.value} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='payment_method'
							rules={{ required: t('announcements.posting.shipping.paymentRequired') }}
							render={({ field }) => (
								<FormItem className='mb-6'>
									<FormLabel className='text-brand'>{t('announcements.posting.shipping.paymentLabel')}</FormLabel>
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
									<FormLabel className='text-brand mb-3'>{t('announcements.posting.shipping.visibilityLabel')}</FormLabel>
									<FormControl>
										<RadioGroup
											onValueChange={(value) => field.onChange(value === 'true')}
											value={(field.value ?? false) ? 'true' : 'false'}
											className='space-y-3'
										>
											<FormItem className='flex items-center gap-3'>
												<FormControl>
													<RadioGroupItem value='false' disabled={isLoadingCreate} />
												</FormControl>
												<FormLabel className='m-0 font-semibold'>{t('announcements.posting.shipping.visible')}</FormLabel>
											</FormItem>
											<FormItem className='flex items-center gap-3'>
												<FormControl>
													<RadioGroupItem value='true' disabled={isLoadingCreate} />
												</FormControl>
												<FormLabel className='m-0 font-semibold'>{t('announcements.posting.shipping.hidden')}</FormLabel>
											</FormItem>
										</RadioGroup>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className='bg-background rounded-4xl sm:p-12 p-4 space-y-4'>
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
				</div>
				<div className='mt-4 flex items-center sm:justify-end justify-center gap-4'>
					<Dialog>
						<DialogTrigger asChild>
							<Button variant={'outline'}>{t('announcements.posting.actions.cancel')}</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogTitle>{t('announcements.posting.cancel.title')}</DialogTitle>
							<DialogDescription>{t('announcements.posting.cancel.description')}</DialogDescription>
							<DialogFooter>
								<DialogClose asChild>
									<Button variant='outline'>{t('announcements.posting.cancel.close')}</Button>
								</DialogClose>
								<DialogClose asChild>
									<Button onClick={() => form.reset()}>{t('announcements.posting.cancel.clear')}</Button>
								</DialogClose>
							</DialogFooter>
						</DialogContent>
					</Dialog>
					<Button disabled={isLoadingCreate} type='submit'>
						{t('announcements.posting.actions.submit')}
					</Button>
				</div>
			</form>
		</Form>
	)
}
