'use client'

import { Button } from '@/components/ui/Button'
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger } from '@/components/ui/Select'
import { IMG_URL, PUBLIC_URL } from '@/config/url.config'
import { SelectValue } from '@radix-ui/react-select'
import Image from 'next/image'
import { useRegisterForm } from './useRegisterForm'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Form } from '@/components/ui/form-control/Form'
import { RegisterFields } from './RegisterField'
import Link from 'next/link'
import { SITE_NAME } from '@/constants/seo.constants'

import { useState } from 'react'
import { AsCargoSaver } from '@/app/svg/AsCargoSaver'
import TruckIcon from '@/app/svg/TruckIcon'
import LogistIcon from '@/app/svg/LogistIcon'
import { RegisterRoles } from './RegisterRoles'
import { Role, RoleEnum } from '@/shared/enums/Role.enum'

const ROLES = [
	{
		key: Role.CUSTOMER,
		title: 'Грузоотправитель',
		icon: AsCargoSaver,
		color: '#1E3A8A',
		description: 'Компания или человек, которому нужно что-то перевезти, хранить или обработать.',
		buttonText: 'грузоотправитель',
	},
	{
		key: Role.CARRIER,
		title: 'Перевозчик',
		icon: TruckIcon,
		color: '#1E3A8A',
		description: 'Исполнитель в логистике. Его задача — взять груз у заказчика и доставить его из точки А в точку Б в сохранности и в срок.',
		buttonText: 'перевозчик',
	},
	{
		key: Role.LOGISTIC,
		title: 'Логист',
		icon: LogistIcon,
		color: '#1E3A8A',
		description:
			'Специалист, который организует и управляет процессом перемещения и хранения товаров, чтобы груз дошёл вовремя и с минимальными затратами.',
		buttonText: 'логист',
	},
]

export function RegisterPage() {
	const { form, isPending, onSubmit } = useRegisterForm()

	const [role, setRole] = useState<RoleEnum>()

	const onClick = (role: RoleEnum) => {
		setRole(role)
	}

	return (
		<div className='min-h-screen grid grid-cols-1 lg:grid-cols-2'>
			<h1 className='sr-only'>Регистрация</h1>
			<div className='bg-[url(/png/bg_auth.png)] h-full hidden lg:flex lg:flex-col items-center justify-center bg-no-repeat bg-cover bg-center px-12'>
				<div className='bg-brand-900 rounded-6xl p-12'>
					<h2 className='text-[32px] text-white font-raleway font-semibold'>
						Высококачественное программное решение для управления вашим бизнес-процессом
					</h2>
				</div>
			</div>
			<div className='flex flex-col h-full sm:px-12 px-4 sm:py-8 py-4'>
				<div className='flex sm:flex-row flex-col gap-4 items-center lg:justify-end justify-between'>
					<Link href={PUBLIC_URL.home()} className='flex lg:hidden'>
						На главную
					</Link>
					<div className='flex items-center justify-center gap-2 flex-wrap'>
						<Link href={PUBLIC_URL.auth()}>
							<Button variant={'outline'} className='bg-accent border-none rounded-full text-[16px] hover:bg-accent/80 px-4 py-3 font-medium'>
								Авторизоваться
							</Button>
						</Link>
						<Select>
							<SelectTrigger
								className='bg-accent border-none rounded-full text-[16px] hover:bg-accent/80 data-[placeholder]:text-primary text-primary font-medium data-[placeholder]:font-medium px-4 py-3 data-[state=open]:bg-brand-900 data-[state=open]:text-white transition-all *:data-[slot=select-value]:bg-brand-900
'
								aria-label='Выберите язык'
							>
								<SelectValue placeholder='Выберите язык' />
							</SelectTrigger>
							<SelectContent className='rounded-2xl'>
								<SelectItem value='UZB' className='rounded-2xl'>
									<div className='flex items-center gap-2.5 font-medium'>
										<Image className='rounded-full' src={IMG_URL.svg('uzb')} width={24} height={24} alt='' /> Узбекский
									</div>
								</SelectItem>
								<SelectSeparator />
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
					<div className='flex flex-1 items-center justify-center'>
						<Card className='w-full max-w-xl border-none bg-transparent shadow-none'>
							<CardHeader className='mb-6'>
								<h1 className='sm:text-5xl text-4xl font-bold text-center mb-12 '>Регистрация</h1>
								{!role && (
									<p className='text-center text-lg font-bold'>
										Добро пожаловать в {SITE_NAME}! <br /> Пожалуйста, выберите вашу роль для регистрации
									</p>
								)}
							</CardHeader>
							{!role ? (
								<CardContent>
									<RegisterRoles roles={ROLES} onSelect={setRole} />
									<Button className='mx-auto block ' variant={'link'}>
										Что такое роли?
									</Button>
								</CardContent>
							) : (
								<CardContent>
									<Form {...form}>
										<form onSubmit={form.handleSubmit((data) => onSubmit({ ...data, role }))}>
											<RegisterFields form={form} isPending={isPending} />
											<Button className='w-full' disabled={isPending}>
												Зарегистрироваться
											</Button>
										</form>
									</Form>
								</CardContent>
							)}
						</Card>
					</div>
				</div>

				<div className='flex gap-4 items-center justify-end'>
					<div className='flex items-center gap-3'>
						<div className={`w-[39px] h-[4px] rounded-[6px] ${!role ? 'bg-brand' : 'bg-brand/40'}`}></div>
						<div className={`w-[39px] h-[4px] rounded-[6px] ${role ? 'bg-brand' : 'bg-brand/40'}`}></div>
					</div>
				</div>
			</div>
		</div>
	)
}
