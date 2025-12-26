'use client'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Form } from '@/components/ui/form-control/Form'
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger } from '@/components/ui/Select'
import { IMG_URL, PUBLIC_URL } from '@/config/url.config'
import { SelectValue } from '@radix-ui/react-select'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { AuthFields } from './AuthField'
import { useAuthForm } from './useAuthForm'

export function AuthPage() {
	const { form, isPending, onSubmit } = useAuthForm()
	const searchParams = useSearchParams()
	const nextParam = searchParams.get('next')
	const registerHref = nextParam ? `${PUBLIC_URL.auth('register')}?next=${encodeURIComponent(nextParam)}` : PUBLIC_URL.auth('register')

	return (
		<div className='min-h-screen grid grid-cols-1 lg:grid-cols-2'>
			<h1 className='sr-only'>Авторизация</h1>
			<div className='bg-[url(/png/bg_auth.png)] h-full flex lg:flex-col items-center justify-center bg-no-repeat bg-cover bg-bottom px-12 min-h-[200px]'>
				<div className='bg-brand-900 rounded-6xl lg:p-12 sm:p-6 p-3'>
					<h2 className='lg:text-[32px] sm:text-xl text-base text-white font-raleway font-semibold'>
						Высококачественное программное решение для управления вашим бизнес-процессом
					</h2>
				</div>
			</div>
			<div className='flex flex-col h-full sm:px-12 px-4 py-8'>
				<div className='flex sm:flex-row flex-col gap-4 items-center lg:justify-end justify-center'>
					<div className='flex items-center justify-center gap-2 flex-wrap'>
						<Link href={registerHref}>
							<Button variant={'outline'} className='bg-accent border-none rounded-full text-[16px] hover:bg-accent/80 px-4 py-3 font-medium'>
								Зарегистрироваться
							</Button>
						</Link>
						<Select>
							<SelectTrigger
								className='bg-accent border-none rounded-full text-[16px] hover:bg-accent/80 data-[placeholder]:text-primary text-primary font-medium data-[placeholder]:font-medium px-4 py-3 data-[state=open]:bg-brand-900 data-[state=open]:text-white transition-all *:data-[slot=select-value]:bg-brand-900 data-[state=open]:[&_svg]:rotate-180 data-[state=open]:[&_svg]:transition-transform data-[state=open]:[&_svg]:duration-200 data-[state=open]:[&_svg]:text-white
'
								aria-label='Выберите язык'
							>
								<SelectValue placeholder='Выберите язык' />
							</SelectTrigger>
							<SelectContent className='rounded-2xl'>
								{/* <SelectItem value='UZB' className='rounded-2xl'>
									<div className='flex items-center gap-2.5 font-medium'>
										<Image className='rounded-full' src={IMG_URL.svg('uzb')} width={24} height={24} alt='' /> Узбекский
									</div>
								</SelectItem>
								<SelectSeparator /> */}
								<SelectItem value='RUS' className='rounded-2xl'>
									<div className='flex items-center gap-2.5 font-medium'>
										<Image className='rounded-full' src={IMG_URL.svg('rus')} width={24} height={24} alt='' /> Русский
									</div>
								</SelectItem>
								<SelectSeparator />
								<SelectItem value='ENG' className='rounded-2xl'>
									<div className='flex items-center gap-2.5 font-medium'>
										<Image className='rounded-full' src={IMG_URL.svg('eng')} width={24} height={24} alt='' /> Английский
									</div>
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
				<div className='flex flex-1 items-center justify-center'>
					<Card className='w-full max-w-xl border-none bg-transparent shadow-none'>
						<CardHeader className='mb-6'>
							<h1 className='text-5xl font-bold text-center'>Войти в аккаунт</h1>
						</CardHeader>
						<CardContent>
							<Form {...form}>
								<form onSubmit={form.handleSubmit(onSubmit)}>
									<AuthFields form={form} isPending={isPending} />
									<Button className='w-full'>Войти</Button>
								</form>
							</Form>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}
