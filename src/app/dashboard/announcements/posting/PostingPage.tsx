'use client'

import { Button } from '@/components/ui/Button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/Dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form-control/Form'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/form-control/InputGroup'
import dynamic from 'next/dynamic'
const RichTextEditor = dynamic(() =>
	import('@/components/ui/form-control/RichEditor/RichTextEditor').then(m => m.RichTextEditor),
)

import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup'
import { CitySelector } from '@/components/ui/selectors/CitySelector'
import { ContactSelector } from '@/components/ui/selectors/ContactSelector'
import { CurrencySelector } from '@/components/ui/selectors/CurrencySelector'
import { DatePicker } from '@/components/ui/selectors/DateSelector'
import { PaymentSelector } from '@/components/ui/selectors/PaymentSelector'
import { TransportSelector } from '@/components/ui/selectors/TransportSelector'
import { handleNumericInput } from '@/lib/InputValidation'
import { cn } from '@/lib/utils'
import { NUMERIC_REGEX, PRODUCT_MAX_LENGTH } from '@/shared/regex/regex'
import { Banknote, Home, } from 'lucide-react'
import { usePostForm } from './usePostForm'

export function PostingPage() {
	const { form, isLoadingCreate, onSubmit } = usePostForm()

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className='grid lg:grid-cols-2 gap-x-6 gap-y-4'>
					<div className='bg-background rounded-4xl sm:p-12 p-4 space-y-4'>
						<FormField
							control={form.control}
							name='origin_city'
							rules={{ required: 'Город погрузки обязателен' }}
							render={({ field }) => (
								<FormItem className='w-full'>
									<FormLabel className='text-brand mb-6 font-bold text-xl'>Откуда</FormLabel>
									<FormControl>
										<CitySelector
											value={field.value || ''}
											onChange={(val, city) => {
												field.onChange(val)
												form.setValue('origin_country', city?.country ?? '')
											}}
											countryCode={undefined}
											placeholder='Город, страна'
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
							rules={{ required: 'Адрес погрузки обязателен' }}
							render={({ field }) => (
								<FormItem className='w-full'>
									<FormControl>
										<InputGroup>
											<InputGroupInput placeholder='Улица, № Дома' {...field} value={field.value ?? ''} disabled={isLoadingCreate} />
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
							rules={{ required: 'Дата погрузки обязательна' }}
							render={({ field }) => (
								<FormItem className='flex flex-col'>
									<FormControl>
										<DatePicker
											value={field.value}
											onChange={field.onChange}
											placeholder='Дата погрузки'
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
							rules={{ required: 'Город разгрузки обязателен' }}
							render={({ field }) => (
								<FormItem className='w-full'>
									<FormLabel className='text-brand mb-6 font-bold text-xl'>Куда</FormLabel>
									<FormControl>
										<CitySelector
											value={field.value || ''}
											onChange={(val, city) => {
												field.onChange(val)
												form.setValue('destination_country', city?.country ?? '')
											}}
											countryCode={undefined}
											placeholder='Город, страна'
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
							rules={{ required: 'Адрес разгрузки обязателен' }}
							render={({ field }) => (
								<FormItem className='w-full'>
									<FormControl>
										<InputGroup>
											<InputGroupInput placeholder='Улица, № Дома' {...field} value={field.value ?? ''} disabled={isLoadingCreate} />
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
							rules={{ required: 'Дата разгрузки обязательна' }}
							render={({ field }) => (
								<FormItem className='flex flex-col'>
									<FormControl>
										<DatePicker
											value={field.value ?? undefined}
											onChange={field.onChange}
											placeholder='Дата разгрузки'
											disabled={isLoadingCreate}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className='bg-background rounded-4xl sm:p-12 p-4 space-y-4 h-full'>
						<p className='text-xl font-bold text-brand'>Детали перевозки</p>
						<div className='flex items-end gap-6'>
							<FormField
								control={form.control}
								name='price_currency'
								rules={{ required: 'Валюта обязателен' }}
								render={({ field }) => (
									<FormItem className='w-1/2'>
										<FormLabel className='text-brand'>Валюта/Цена</FormLabel>
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
									required: 'Цена обязательна',
								}}
								render={({ field }) => (
									<FormItem className='w-1/2'>
										<FormControl>
											<InputGroup>
												<InputGroupInput
													placeholder='Цена'
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
									required: 'Габариты обязательны',

								}}
								render={({ field }) => (
									<FormItem className='w-1/2'>
										<FormLabel className='text-brand'>Габариты</FormLabel>
										<FormControl>
											<InputGroup>
												<InputGroupInput
													placeholder='Объем(Куб. М)'
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
								// rules={{ required: 'Оси обязательны' }}
								render={({ field }) => (
									<FormItem className='w-1/2'>
										<FormControl>
											<InputGroup>
												<InputGroupInput placeholder='Оси (3-10)' {...field} value={field.value ?? ''} onChange={(event) => handleNumericInput(event, NUMERIC_REGEX, field.onChange)} className='pl-4' disabled={isLoadingCreate} />
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
							rules={{ required: 'Предпочтение обязательно' }}
							render={({ field }) => (
								<FormItem className='mb-6'>
									<FormLabel className='text-brand'>Выберите вариант размещения ваших способов связи</FormLabel>
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
							rules={{ required: 'Метод оплаты обязателен' }}
							render={({ field }) => (
								<FormItem className='mb-6'>
									<FormLabel className='text-brand'>Выберите способ оплаты</FormLabel>
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
									<FormLabel className='text-brand mb-3'>Видимость объявления</FormLabel>
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
												<FormLabel className='m-0 font-semibold'>Видна</FormLabel>
											</FormItem>
											<FormItem className='flex items-center gap-3'>
												<FormControl>
													<RadioGroupItem value='true' disabled={isLoadingCreate} />
												</FormControl>
												<FormLabel className='m-0 font-semibold'>Скрыта</FormLabel>
											</FormItem>
										</RadioGroup>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className='bg-background rounded-4xl sm:p-12 p-4 space-y-4'>
						<p className='text-xl font-bold text-brand'>Детали оборудования</p>
						<FormField
							control={form.control}
							name='product'
							rules={{
								required: 'Наименование груза обязательно',
								maxLength: {
									value: PRODUCT_MAX_LENGTH,
									message: 'Название продукта максимум 120 символов',
								},
							}}
							render={({ field }) => (
								<FormItem className='w-full'>
									<FormControl>
										<InputGroup>
											<InputGroupInput
												placeholder='Наименование груза'
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
						{/* <FormField
							control={form.control}
							name='product'
							render={({ field }) => (
								<FormItem className='w-full'>
									<FormControl>
										<InputGroup>
											<InputGroupInput placeholder='Товар' {...field} value={field.value ?? ''} className='pl-4' disabled={isLoadingCreate} />
										</InputGroup>
									</FormControl>
								</FormItem>
							)}
						/> */}
						<FormField
							control={form.control}
							name='transport_type'
							rules={{ required: 'Тип транспорта обязателен' }}

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
								required: 'Вес обязателен',
								pattern: {
									value: NUMERIC_REGEX,
									message: 'Вес должен быть числом',
								},
							}}

							render={({ field }) => (
								<FormItem className='w-full'>
									<FormControl>
										<InputGroup>
											<InputGroupInput
												placeholder='Вес(т)'
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
											placeholder='Опишите объявление: груз, сроки, условия и важные детали'
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
							<Button variant={'outline'}>Отменить</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogTitle>Вы уверены что хотите отменить публикацию?</DialogTitle>
							<DialogDescription>Это действие нельзя отменить. Все поля будут очищены</DialogDescription>
							<DialogFooter>
								<DialogClose asChild>
									<Button variant='outline'>Закрыть</Button>
								</DialogClose>
								<DialogClose asChild>
									<Button onClick={() => form.reset()}>Очистить</Button>
								</DialogClose>
							</DialogFooter>
						</DialogContent>
					</Dialog>
					<Button disabled={isLoadingCreate} type='submit'>Опубликовать</Button>
				</div>
			</form>
		</Form>
	)
}
