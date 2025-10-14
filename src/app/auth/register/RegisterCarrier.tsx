import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form-control/Form'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/form-control/InputGroup'
import { RegisterDto } from '@/shared/types/Registration.interface'
import { Phone, User } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { RoleEnum } from '@/shared/enums/Role.enum'
import { useState } from 'react'
import { CitySelect } from '@/components/ui/selectors/CitySelector'
import { CountrySelect } from '@/components/ui/selectors/CountrySelector'
import { City, Country } from '@/shared/types/Geo.interface'

interface RegisterFieldsProps {
	form: UseFormReturn<RegisterDto, undefined>
	isPending: boolean
	role: RoleEnum
}

export function RegisterCarrierFields({ form, isPending, role }: RegisterFieldsProps) {
	const [hasTransport, setHasTransport] = useState(false)
	const [country, setCountry] = useState<Country | null>(null)
	const [city, setCity] = useState<City | null>(null)

	const handleCountrySelect = (selected: Country) => {
		setCountry(selected)
		form.setValue('country', selected.name)
		form.setValue('country_code', selected.code)
	}

	const handleCitySelect = (selected: City) => {
		setCity(selected)
		form.setValue('city', selected.name)
	}

	if (role === RoleEnum.CARRIER) {
		return (
			<>
				{/* ФИО */}
				<FormField
					control={form.control}
					name='first_name'
					rules={{ required: 'ФИО обязательно' }}
					render={({ field }) => (
						<FormItem className='mb-6'>
							<FormLabel className='text-grayscale'>Введите Ф.И.О.</FormLabel>
							<FormControl>
								<InputGroup>
									<InputGroupInput placeholder='Введите Ф.И.О.' disabled={isPending} {...field} value={field.value ?? ''} />
									<InputGroupAddon className='pr-2'>
										<User className='text-grayscale size-5' />
									</InputGroupAddon>
								</InputGroup>
							</FormControl>
						</FormItem>
					)}
				/>

				{/* Номер телефона */}
				<FormField
					control={form.control}
					name='phone'
					rules={{ required: 'Номер обязателен' }}
					render={({ field }) => (
						<FormItem className='mb-6'>
							<FormLabel className='text-grayscale'>Введите номер</FormLabel>
							<FormControl>
								<InputGroup>
									<InputGroupInput placeholder='+998 ...' disabled={isPending} {...field} value={field.value ?? ''} />
									<InputGroupAddon className='pr-2'>
										<Phone className='text-grayscale size-5' />
									</InputGroupAddon>
								</InputGroup>
							</FormControl>
						</FormItem>
					)}
				/>

				{/* Страна / Город */}
				<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6'>
					{/* Страна */}
					<FormField
						control={form.control}
						name='country'
						render={() => (
							<FormItem>
								<FormLabel className='text-grayscale'>Страна</FormLabel>
								<FormControl>
									<CountrySelect value={country || undefined} onChange={(val) => handleCountrySelect(val)} />
								</FormControl>
							</FormItem>
						)}
					/>

					{/* Город */}
					<FormField
						control={form.control}
						name='city'
						render={() => (
							<FormItem>
								<FormLabel className='text-grayscale'>Город</FormLabel>
								<FormControl>
									<CitySelect value={city || undefined} onChange={(val) => handleCitySelect(val)} countryCode={country?.code} disabled={!country} />
								</FormControl>
							</FormItem>
						)}
					/>
				</div>

				<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6'>
					{/* Компания */}
					<FormField
						control={form.control}
						name='company_name'
						rules={{ required: 'Название компании обязательно' }}
						render={({ field }) => (
							<FormItem>
								<FormLabel className='text-grayscale'>Введите название компании</FormLabel>
								<FormControl>
									<InputGroup>
										<InputGroupInput
											className='pl-3'
											placeholder='Введите название компании'
											disabled={isPending}
											{...field}
											value={field.value ?? ''}
										/>
									</InputGroup>
								</FormControl>
							</FormItem>
						)}
					/>

					{/* Транспорт */}
					<FormField
						control={form.control}
						name='transport_name'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='text-grayscale'>Транспорт</FormLabel>
								<FormControl>
									<InputGroup>
										<InputGroupInput
											placeholder='Введите название транспорта'
											className='pl-3'
											disabled={isPending}
											{...field}
											value={field.value ?? ''}
											onChange={(e) => {
												field.onChange(e)
												setHasTransport(e.target.value.trim().length > 0)
											}}
										/>
									</InputGroup>
								</FormControl>
							</FormItem>
						)}
					/>
				</div>

				{/* Если есть транспорт */}
				{hasTransport && (
					<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6'>
						<FormField
							control={form.control}
							name='car_number'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='text-grayscale'>Введите номер машины</FormLabel>
									<FormControl>
										<InputGroup>
											<InputGroupInput
												className='pl-2'
												placeholder='Введите номер машины'
												disabled={isPending}
												{...field}
												value={field.value ?? ''}
											/>
										</InputGroup>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='trailer_number'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='text-grayscale'>Введите номер прицепа</FormLabel>
									<FormControl>
										<InputGroup>
											<InputGroupInput
												className='pl-2'
												placeholder='Введите номер прицепа'
												disabled={isPending}
												{...field}
												value={field.value ?? ''}
											/>
										</InputGroup>
									</FormControl>
								</FormItem>
							)}
						/>
					</div>
				)}
			</>
		)
	}
}
