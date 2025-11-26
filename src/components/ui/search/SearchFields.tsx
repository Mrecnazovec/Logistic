'use client'

import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form-control/Form'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/form-control/InputGroup'
import { CitySelector } from '@/components/ui/selectors/CitySelector'
import { ArrowRight, Search, Settings2, Trash2 } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'

import { Button } from '@/components/ui/Button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup'
import { handleNumericInput } from '@/lib/InputValidation'
import { cn } from '@/lib/utils'
import { NUMERIC_REGEX } from '@/shared/regex/regex'
import { ISearch } from '@/shared/types/Search.interface'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { CurrencySelector } from '../selectors/CurrencySelector'
import { DatePicker } from '../selectors/DateSelector'
import { TransportSelector } from '../selectors/TransportSelector'

interface SearchFieldsProps {
	form: UseFormReturn<ISearch, undefined>
	showOffersFilter?: boolean
}

export function SearchFields({ form, showOffersFilter }: SearchFieldsProps) {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const priceCurrency = form.watch('price_currency')
	const isPriceEnabled = Boolean(priceCurrency)
	const hasQuery = searchParams.toString().length > 0

	const handleDeleteFilter = () => {
		router.push(pathname)
		form.reset({}, { keepDefaultValues: false })
	}

	const renderCurrencyBadge = () => (
		<span className='w-5 h-5 rounded-sm border border-grayscale-200 bg-grayscale-50 text-[10px] leading-[14px] text-black flex items-center justify-center'>
			{priceCurrency ?? '—'}
		</span>
	)

	return (
		<>
			<div className='flex items-center gap-3 mb-6'>
				<FormField
					control={form.control}
					name='uuid'
					render={({ field }) => (
						<FormItem className='w-full'>
							<FormControl>
								<InputGroup>
									<InputGroupInput placeholder='Поиск по id' {...field} value={field.value ?? ''} />
									<InputGroupAddon className='pr-2'>
										<Search className={cn('text-grayscale size-5', field.value && 'text-black')} />
									</InputGroupAddon>
								</InputGroup>
							</FormControl>
						</FormItem>
					)}
				/>
				<Popover>
					<PopoverTrigger asChild>
						<Button variant={'outline'} className='bg-transparent border border-brand text-brand hover:bg-transparent hover:text-brand'>
							<Settings2 className='size-5' />
							Фильтр
						</Button>
					</PopoverTrigger>
					<PopoverContent align='end' className='space-y-3'>
						<div className='flex items-center justify-between pb-3 border-b'>
							<p className='text-sm font-medium'>Фильтр</p>
						</div>
						<FormField
							control={form.control}
							name='price_currency'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='text-grayscale flex items-center gap-2'>
										Цена
										{renderCurrencyBadge()}
									</FormLabel>
									<FormControl>
										<CurrencySelector value={field.value} onChange={field.onChange} />
									</FormControl>
								</FormItem>
							)}
						/>
						<div className='flex items-end gap-1'>
							<FormField
								control={form.control}
								name='min_price'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-grayscale'>От</FormLabel>
										<FormControl>
											<InputGroup>
												<InputGroupInput
													placeholder='От'
													{...field}
													disabled={!isPriceEnabled}
													value={field.value ?? ''}
													className='pl-4'
													onChange={(event) => handleNumericInput(event, NUMERIC_REGEX, field.onChange)}
												/>
											</InputGroup>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='max_price'
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<InputGroup>
												<InputGroupInput
													placeholder='До'
													{...field}
													disabled={!isPriceEnabled}
													value={field.value ?? ''}
													className='pl-4'
													onChange={(event) => handleNumericInput(event, NUMERIC_REGEX, field.onChange)}
												/>
											</InputGroup>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>
						{showOffersFilter ? (
							<FormField
								control={form.control}
								name='has_offers'
								render={({ field }) => {
									const value =
										field.value === undefined ? '' : field.value === true ? 'true' : field.value === false ? 'false' : String(field.value)

									return (
										<FormItem>
											<FormLabel className='text-grayscale'>Предложения</FormLabel>
											<FormControl>
												<RadioGroup
													className=''
													value={value}
													onValueChange={(next) => field.onChange(next === 'true')}
												>
													<label className='flex items-center gap-2 rounded-4xl px-3 py-2 text-sm cursor-pointer bg-grayscale-50 h-13'>
														<RadioGroupItem value='true' />
														С предложениями
													</label>
													<label className='flex items-center gap-2 rounded-4xl px-3 py-2 text-sm cursor-pointer bg-grayscale-50 h-13'>
														<RadioGroupItem value='false' />
														Без предложений
													</label>
												</RadioGroup>
											</FormControl>
										</FormItem>
									)
								}}
							/>
						) : null}
						<div className='flex items-end gap-1'>
							<FormField
								control={form.control}
								name='min_weight'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-grayscale'>Вес от</FormLabel>
										<FormControl>
											<InputGroup>
												<InputGroupInput placeholder='От' {...field} value={field.value ?? ''} className='pl-4' onChange={(event) => handleNumericInput(event, NUMERIC_REGEX, field.onChange)} />
											</InputGroup>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='max_weight'
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<InputGroup>
												<InputGroupInput placeholder='До' {...field} value={field.value ?? ''} className='pl-4' onChange={(event) => handleNumericInput(event, NUMERIC_REGEX, field.onChange)} />
											</InputGroup>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>
					</PopoverContent>
				</Popover>
				{hasQuery ? (
					<Button
						variant='destructive'
						type='button'
						onClick={handleDeleteFilter}
						title='Сбросить фильтр'
					>
						<Trash2 className='size-4' />
					</Button>
				) : null}
			</div>
			<div className='flex lg:flex-row flex-col justify-between items-center gap-3'>
				<div className='flex gap-3 w-full'>
					<FormField
						control={form.control}
						name='origin_city'
						render={({ field }) => (
							<FormItem className='w-full'>
								<FormControl>
									<CitySelector {...field} countryCode={undefined} placeholder='Откуда' />
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='origin_radius_km'
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<InputGroup>
										<InputGroupInput placeholder='Радиус' {...field} value={field.value ?? ''} className='pl-4' onChange={(event) => handleNumericInput(event, NUMERIC_REGEX, field.onChange)} />
									</InputGroup>
								</FormControl>
							</FormItem>
						)}
					/>
				</div>
				<ArrowRight className='size-5 flex text-grayscale shrink-0' />
				<div className='flex gap-3 w-full'>
					<FormField
						control={form.control}
						name='destination_city'
						render={({ field }) => (
							<FormItem className='w-full'>
								<FormControl>
									<CitySelector {...field} countryCode={' '} placeholder='Куда' />
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='dest_radius_km'
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<InputGroup>
										<InputGroupInput placeholder='Радиус' {...field} value={field.value ?? ''} className='pl-4' onChange={(event) => handleNumericInput(event, NUMERIC_REGEX, field.onChange)} />
									</InputGroup>
								</FormControl>
							</FormItem>
						)}
					/>
				</div>
				<FormField
					control={form.control}
					name='transport_type'
					render={({ field }) => (
						<FormItem className='max-lg:w-full'>
							<FormControl>
								<TransportSelector value={field.value} onChange={field.onChange} />
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='load_date'
					render={({ field }) => (
						<FormItem className='flex flex-col max-lg:w-full'>
							<FormControl>
								<DatePicker
									value={field.value}
									onChange={field.onChange}
									placeholder='Дата погрузки'
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<Button type='submit' className='max-lg:w-full'>
					<Search className='size-5' />
					Поиск
				</Button>
			</div>
		</>
	)
}
