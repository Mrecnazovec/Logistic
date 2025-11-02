'use client'

import { Button } from '@/components/ui/Button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/Dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form-control/Form'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/form-control/InputGroup'
import { Label } from '@/components/ui/form-control/Label'
import dynamic from 'next/dynamic'
const RichTextEditor = dynamic(() =>
	import('@/components/ui/form-control/RichEditor/RichTextEditor').then(m => m.RichTextEditor),
)

import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { CitySelector } from '@/components/ui/selectors/CitySelector'
import { CurrencySelector } from '@/components/ui/selectors/CurrencySelector'
import { DatePicker } from '@/components/ui/selectors/DateSelector'
import { TransportSelector } from '@/components/ui/selectors/TransportSelector'
import { cn } from '@/lib/utils'
import { ContactSelector } from '@/shared/enums/ContactPref.enum'
import { City } from '@/shared/types/Geo.interface'
import { Banknote, Home, Phone } from 'lucide-react'
import { useState } from 'react'
import { usePostForm } from './usePostForm'
import { DASHBOARD_URL } from '@/config/url.config'

export function PostingPage() {
	const { form, isLoadingCreate, onSubmit } = usePostForm()
	const [originCity, setOriginCity] = useState<City | null>(null)
	const [destinationCity, setDestinationCity] = useState<City | null>(null)


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
											countryCode=' '
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
											countryCode=' '
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
								rules={{ required: 'Цена обязательна' }}
								render={({ field }) => (
									<FormItem className='w-1/2'>
										<FormControl>
											<InputGroup>
												<InputGroupInput placeholder='Цена' {...field} value={field.value ?? ''} disabled={isLoadingCreate} />
												<InputGroupAddon className='pr-2'>
													<Banknote className='text-grayscale size-5' />
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
								name='weight_kg'
								rules={{ required: 'Габариты обязательны' }}
								render={({ field }) => (
									<FormItem className='w-1/2'>
										<FormLabel className='text-brand'>Габариты</FormLabel>
										<FormControl>
											<InputGroup>
												<InputGroupInput
													placeholder='Объем(Куб. М)'
													{...field}
													value={field.value ?? ''}
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
								name='route_km'
								rules={{ required: 'Оси обязательны' }}
								render={({ field }) => (
									<FormItem className='w-1/2'>
										<FormControl>
											<InputGroup>
												<InputGroupInput placeholder='Оси (3-10)' {...field} value={field.value ?? ''} className='pl-4' disabled={isLoadingCreate} />
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
									<FormControl>
										<Select onValueChange={field.onChange} value={field.value ?? ''}>
											<SelectTrigger className='rounded-full text-grayscale bg-grayscale-50 border-none [&_span]:text-grayscale w-full'>
												<div className='flex gap-4'>
													<Phone className='size-5' />
													<SelectValue placeholder='Способ связи' />
												</div>
											</SelectTrigger>
											<SelectContent>
												{ContactSelector.map((item) => (
													<SelectItem key={item.type} value={item.type}>
														{item.name}
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
							name='is_hidden'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='text-brand mb-6'>Выберите вариант размещения</FormLabel>
									<FormControl>
										<RadioGroup defaultValue='false' className='flex gap-6' onValueChange={(val) => field.onChange(val === 'true')} value={field.value ? 'true' : 'false'}>
											<div className='flex items-center space-x-2'>
												<RadioGroupItem value='false' id='visible' />
												<Label htmlFor='visible'>Показывать</Label>
											</div>
											<div className='flex items-center space-x-2'>
												<RadioGroupItem value='true' id='hidden' />
												<Label htmlFor='hidden'>Скрывать</Label>
											</div>
										</RadioGroup>
									</FormControl>
								</FormItem>
							)}
						/>
					</div>
					<div className='bg-background rounded-4xl sm:p-12 p-4 space-y-4'>
						<p className='text-xl font-bold text-brand'>Детали оборудования</p>
						<FormField
							control={form.control}
							name='product'
							rules={{ required: 'Наименование груза обязательно' }}
							render={({ field }) => (
								<FormItem className='w-full'>
									<FormControl>
										<InputGroup>
											<InputGroupInput
												placeholder='Наименование груза'
												{...field}
												value={field.value ?? ''}
												className='pl-4'
												disabled={isLoadingCreate}
											/>
										</InputGroup>
									</FormControl>
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
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<TransportSelector onChange={field.onChange} value={field.value} disabled={isLoadingCreate} />
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='weight_kg'
							render={({ field }) => (
								<FormItem className='w-full'>
									<FormControl>
										<InputGroup>
											<InputGroupInput placeholder='Вес(тонна)' {...field} value={field.value ?? ''} className='pl-4' disabled={isLoadingCreate} />
										</InputGroup>
									</FormControl>
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
					<Button type='submit'>Опубликовать</Button>
				</div>
			</form>
		</Form>
	)
}
