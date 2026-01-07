'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Search, Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/Drawer'
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form-control/Form'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/form-control/InputGroup'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { CountrySelector } from '@/components/ui/selectors/CountrySelector'
import { useI18n } from '@/i18n/I18nProvider'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'
import type { Country } from '@/shared/types/Geo.interface'
import { ISearch } from '@/shared/types/Search.interface'
import { useSearchDrawerStore } from '@/store/useSearchDrawerStore'

interface SearchFieldsProps {
	form: UseFormReturn<ISearch, undefined>
	onSubmit: () => void | Promise<void>
}

export function SearchRatingFields({ form, onSubmit }: SearchFieldsProps) {
	const { t } = useI18n()
	const router = useRouter()
	const pathname = usePathname()
	const isDesktop = useMediaQuery('(min-width: 1024px)')
	const { isOpen: isDrawerOpen, setOpen: setIsDrawerOpen, close: closeDrawer } = useSearchDrawerStore()
	const countryCodeValue = form.watch('code')
	const [manualSelectedCountry, setManualSelectedCountry] = useState<Country | null>(null)
	const selectedCountry = useMemo(() => {
		if (!countryCodeValue) return null
		if (manualSelectedCountry?.code === String(countryCodeValue)) return manualSelectedCountry
		return { code: String(countryCodeValue), name: String(countryCodeValue) }
	}, [countryCodeValue, manualSelectedCountry])

	const handleDeleteFilter = () => {
		form.reset()
		router.push(pathname)
		setManualSelectedCountry(null)
	}

	const searchButton = (
		<Button
			type={isDesktop ? 'submit' : 'button'}
			className='max-lg:w-full flex'
			onClick={
				isDesktop
					? undefined
					: () => {
						onSubmit()
						closeDrawer()
					}
			}
		>
			<Search className='size-5' />
			{t('components.searchRating.search')}
		</Button>
	)

	const content = (
		<>
			<div className='flex items-center gap-3 mb-6'>
				<FormField
					control={form.control}
					name='id'
					render={({ field }) => (
						<FormItem className='w-full'>
							<FormControl>
								<InputGroup>
									<InputGroupInput placeholder={t('components.searchRating.byId')} {...field} value={field.value ?? ''} />
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
						<Button variant='outline' className='bg-transparent border border-brand text-brand hover:bg-transparent hover:text-brand'>
							<Settings2 className='size-5' />
							{t('components.searchRating.filters')}
						</Button>
					</PopoverTrigger>
					<PopoverContent align='end' className='space-y-3'>
						<div className='flex items-center justify-between pb-3 border-b'>
							<p className='text-sm font-medium'>{t('components.searchRating.filters')}</p>
							<Button onClick={() => handleDeleteFilter()} type='button' variant='link' className='text-brand underline p-0 h-fit text-[10px]'>
								{t('components.searchRating.reset')}
							</Button>
						</div>

						<div className='flex flex-col gap-3'>
							<FormField
								control={form.control}
								name='rating_min'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-grayscale'>{t('components.searchRating.rating')}</FormLabel>
										<FormControl>
											<InputGroup>
												<InputGroupInput placeholder={t('components.searchRating.from')} {...field} value={field.value ?? ''} className='pl-4' />
											</InputGroup>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='rating_max'
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<InputGroup>
												<InputGroupInput placeholder={t('components.searchRating.to')} {...field} value={field.value ?? ''} className='pl-4' />
											</InputGroup>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='code'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-grayscale'>{t('components.searchRating.country')}</FormLabel>
										<FormControl>
											<CountrySelector
												value={selectedCountry ?? (field.value ? { name: String(field.value), code: String(field.value) } : null)}
												onChange={(country) => {
													setManualSelectedCountry(country)
													field.onChange(country.code)
												}}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>
					</PopoverContent>
				</Popover>
			</div>
			<div className='flex lg:flex-row flex-col justify-end gap-3'>
				{searchButton}
			</div>
		</>
	)

	if (isDesktop) {
		return content
	}

	return (
		<Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
			<DrawerContent className='max-h-[90vh] overflow-y-auto pb-6'>
				<DrawerHeader>
					<DrawerTitle>{t('components.searchRating.search')}</DrawerTitle>
				</DrawerHeader>
				<div className='space-y-6 px-4'>
					{content}
				</div>
			</DrawerContent>
		</Drawer>
	)
}
