'use client'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form-control/Form'
import { usePostForm } from './usePostForm'
import { CitySelect } from '@/components/ui/selectors/CitySelector'
import { useState } from 'react'
import { City } from '@/shared/types/Geo.interface'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { Button } from '@/components/ui/Button'
import { Banknote, CalendarIcon, FormInput, Home, Phone, SquaresIntersect } from 'lucide-react'
import { ru } from 'date-fns/locale'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/Calendar'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/form-control/InputGroup'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { PriceSelector } from '@/shared/enums/PriceCurrency.enum'
import { TransportSelector } from '@/shared/enums/TransportType.enum'
import { ContactSelector } from '@/shared/enums/ContactPref.enum'
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup'
import { Label } from '@/components/ui/form-control/Label'
import { RichTextEditor } from '@/components/ui/form-control/RichEditor/RichTextEditor'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/Dialog'

export function PostingPage() {
	const { form, isLoadingCreate, onSubmit } = usePostForm()
	const [originCity, setOriginCity] = useState<City | null>(null)
	const [destinationCity, setDestinationCity] = useState<City | null>(null)

	const handleOriginCitySelect = (selected: City) => {
		setOriginCity(selected)
		form.setValue('origin_city', selected.name)
		form.setValue('origin_country', selected.country)
	}

	const handleDestinationCitySelect = (selected: City) => {
		setDestinationCity(selected)
		form.setValue('destination_city', selected.name)
		form.setValue('destination_country', selected.country)
	}
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className='grid lg:grid-cols-2 gap-x-6 gap-y-4'>
					<div className='bg-background rounded-[32px] sm:p-12 p-4 space-y-4'>
						<FormField
							control={form.control}
							name='origin_city'
							rules={{ required: 'Город погрузки обязателен' }}
							render={() => (
								<FormItem className='w-full'>
									<FormLabel className='text-brand mb-6 font-bold text-xl'>Откуда</FormLabel>
									<FormControl>
										<CitySelect
											value={originCity || undefined}
											onChange={(val) => handleOriginCitySelect(val)}
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
												<Home className='text-grayscale size-5' />
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
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant='outline'
													className='justify-start text-left text-grayscale bg-grayscale-50 border-none hover:text-grayscale font-normal'
													disabled={isLoadingCreate}
												>
													<CalendarIcon className='size-5 mr-2' />
													{field.value ? format(new Date(field.value), 'dd MMMM yyyy', { locale: ru }) : 'Дата погрузки'}
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className='w-auto p-0' align='start'>
											<Calendar
												mode='single'
												selected={field.value ? new Date(field.value) : undefined}
												onSelect={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className='bg-background rounded-[32px] sm:p-12 p-4 space-y-4'>
						<FormField
							control={form.control}
							name='destination_city'
							rules={{ required: 'Город разгрузки обязателен' }}
							render={() => (
								<FormItem className='w-full'>
									<FormLabel className='text-brand mb-6 font-bold text-xl'>Куда</FormLabel>
									<FormControl>
										<CitySelect
											value={destinationCity || undefined}
											onChange={(val) => handleDestinationCitySelect(val)}
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
												<Home className='text-grayscale size-5' />
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
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant='outline'
													className='justify-start text-left text-grayscale bg-grayscale-50 border-none hover:text-grayscale font-normal'
													disabled={isLoadingCreate}
												>
													<CalendarIcon className='size-5 mr-2' />
													{field.value ? format(new Date(field.value), 'dd MMMM yyyy', { locale: ru }) : 'Дата разгрузки'}
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className='w-auto p-0' align='start'>
											<Calendar
												mode='single'
												selected={field.value ? new Date(field.value) : undefined}
												onSelect={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className='bg-background rounded-[32px] sm:p-12 p-4 space-y-4 h-full'>
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
											<Select onValueChange={field.onChange} value={field.value ?? ''}>
												<SelectTrigger className='w-full rounded-full text-grayscale bg-grayscale-50 border-none [&_span]:text-grayscale'>
													<SelectValue className='' placeholder='Валюта' />
												</SelectTrigger>
												<SelectContent>
													{PriceSelector.map((item) => (
														<SelectItem value={item.type} key={item.type}>
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
					<div className='bg-background rounded-[32px] sm:p-12 p-4 space-y-4'>
						<p className='text-xl font-bold text-brand'>Детали оборудования</p>
						<FormField
							control={form.control}
							name='product'
							rules={{ required: 'Город обязателен' }}
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
						<FormField
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
						/>
						<FormField
							control={form.control}
							name='transport_type'
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Select onValueChange={field.onChange} value={field.value ?? ''}>
											<SelectTrigger className='rounded-full text-grayscale bg-grayscale-50 border-none [&_span]:text-grayscale w-full'>
												<div className='flex gap-4'>
													<SquaresIntersect className='size-5' />
													<SelectValue className='' placeholder='Тип транспорта' />
												</div>
											</SelectTrigger>
											<SelectContent>
												{TransportSelector.map((item) => (
													<SelectItem key={item.type} value={item.type}>
														{item.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
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
