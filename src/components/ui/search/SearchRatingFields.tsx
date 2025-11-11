'use client'

import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form-control/Form'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/form-control/InputGroup'
import { Search, Settings2 } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'

import { Button } from '@/components/ui/Button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { cn } from '@/lib/utils'
import { ISearch } from '@/shared/types/Search.interface'
import { usePathname, useRouter } from 'next/navigation'

interface SearchFieldsProps {
	form: UseFormReturn<ISearch, undefined>
}

export function SearchRatingFields({ form }: SearchFieldsProps) {
	const router = useRouter()
	const pathname = usePathname()

	const handleDeleteFilter = () => {
		form.reset()

		router.push(pathname)
	}

	return (
		<>
			<div className='flex items-center gap-3 mb-6'>
				<FormField
					control={form.control}
					name='id'
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
							<Button onClick={() => handleDeleteFilter()} type='button' variant={'link'} className='text-brand underline p-0 h-fit text-[10px]'>
								Очистить фильтр
							</Button>
						</div>


						<div className='flex items-end gap-1'>
							<FormField
								control={form.control}
								name='min_weight'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-grayscale'>Рейтинг</FormLabel>
										<FormControl>
											<InputGroup>
												<InputGroupInput placeholder='От' {...field} value={field.value ?? ''} className='pl-4' />
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
												<InputGroupInput placeholder='До' {...field} value={field.value ?? ''} className='pl-4' />
											</InputGroup>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>
					</PopoverContent>
				</Popover>
			</div>
			<div className='flex lg:flex-row flex-col justify-end gap-3'>
				<Button type='submit' className='max-lg:w-full flex'>
					<Search className='size-5' />
					Поиск
				</Button>
			</div>
		</>
	)
}
