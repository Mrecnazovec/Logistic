'use client'

import { Button } from '@/components/ui/Button'
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { IMG_URL, PUBLIC_URL } from '@/config/url.config'
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
import { RoleEnum } from '@/shared/enums/Role.enum'
import { RegisterCarrierFields } from './RegisterCarrier'

const ROLES = [
	{
		key: RoleEnum.CUSTOMER,
		title: 'Грузовладелец',
		icon: AsCargoSaver,
		color: '#1E3A8A',
		description: 'Компания или человек, которому нужно что-то перевезти, хранить или обработать.',
		buttonText: 'грузовладелец',
	},
	{
		key: RoleEnum.CARRIER,
		title: 'Перевозчик',
		icon: TruckIcon,
		color: '#1E3A8A',
		description: 'Исполнитель в логистике. Его задача — взять груз у заказчика и доставить его из точки А в точку Б в сохранности и в срок.',
		buttonText: 'перевозчик',
	},
	{
		key: RoleEnum.LOGISTIC,
		title: 'Экспедитор',
		icon: LogistIcon,
		color: '#1E3A8A',
		description:
			'Специалист, который организует и управляет процессом перемещения и хранения товаров, чтобы груз дошёл вовремя и с минимальными затратами.',
		buttonText: 'экспедитор',
	},
]

export function RegisterPage() {
	const { form, isPending, onSubmit } = useRegisterForm()

	const [role, setRole] = useState<RoleEnum>()
	const [step, setStep] = useState<1 | 2>(1)

	const handleNext = async () => {
		const isValid = await form.trigger()
		if (isValid) {
			setStep(2)
		} else {
			const firstErrorField = Object.keys(form.formState.errors)[0]
			if (firstErrorField) {
				const element = document.querySelector(`[name="${firstErrorField}"]`)
				element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
			}
		}
	}
	const handleBack = () => setStep(1)

	return (
		<div className='min-h-screen grid grid-cols-1 lg:grid-cols-2'>
			<h1 className='sr-only'>Регистрация</h1>
			<div className='bg-[url(/png/bg_auth.png)] h-full flex lg:flex-col items-center justify-center bg-no-repeat bg-cover bg-bottom px-12 py-16 min-h-[200px]'>
				<div className='bg-brand-900 rounded-6xl lg:p-12 sm:p-6 p-3'>
					<h2 className='lg:text-[32px] sm:text-xl text-base text-white font-raleway font-semibold'>
						Высококачественное программное решение для управления вашим бизнес-процессом
					</h2>
				</div>
			</div>
			<div className='flex flex-col h-full sm:px-12 px-4 py-8'>
				<div className='flex sm:flex-row flex-col gap-4 items-center lg:justify-end justify-center'>
					<div className='flex items-center justify-center gap-2 flex-wrap'>
						<Link href={PUBLIC_URL.auth()}>
							<Button variant={'outline'} className='bg-accent border-none rounded-full text-[16px] hover:bg-accent/80 px-4 py-3 font-medium'>
								Авторизоваться
							</Button>
						</Link>
						<Select>
							<SelectTrigger
								className='bg-accent border-none rounded-full text-[16px] hover:bg-accent/80 data-[placeholder]:text-primary text-primary font-medium data-[placeholder]:font-medium px-4 py-3 data-[state=open]:bg-brand-900 data-[state=open]:text-white transition-all 
'
								aria-label='Выберите язык'
							>
								<SelectValue className='bg-transparent text-foreground' placeholder='Выберите язык' />
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
					<Card className='w-full max-w-xl border-none bg-transparent shadow-none'>
						<CardHeader className='mb-6'>
							<h1 className='sm:text-5xl text-4xl font-bold text-center'>
								{!role ? 'Регистрация' : step === 1 ? 'Регистрация' : 'Информация о компании'}
							</h1>
							{!role && (
								<p className='text-center text-lg font-bold mt-6'>
									Добро пожаловать в {SITE_NAME}! <br /> Пожалуйста, выберите вашу роль для регистрации
								</p>
							)}
						</CardHeader>

						{!role ? (
							<CardContent>
								<RegisterRoles roles={ROLES} onSelect={setRole} />
								<Button className='mx-auto block' variant={'link'}>
									Что такое роли?
								</Button>
							</CardContent>
						) : (
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit((data) =>
										onSubmit({
											...data,
											role,
										})
									)}
								>
									<CardContent>
										{role !== RoleEnum.CARRIER || step === 1 ? (
											<>
												<RegisterFields form={form} isPending={isPending} role={role} />
												{role === RoleEnum.CARRIER ? (
													<Button type='button' className='w-full' disabled={isPending} onClick={handleNext}>
														Продолжить
													</Button>
												) : (
													<Button type='submit' className='w-full' disabled={isPending}>
														Зарегистрироваться
													</Button>
												)}
											</>
										) : (
											<>
												<RegisterCarrierFields role={role} form={form} isPending={isPending} />
												<div className='flex justify-between items-center gap-4'>
													<Button type='button' variant={'outline'} onClick={handleBack} disabled={isPending}>
														Назад
													</Button>
													<Button type='submit' disabled={isPending}>
														Зарегистрироваться
													</Button>
												</div>
											</>
										)}
									</CardContent>
								</form>
							</Form>
						)}
					</Card>
				</div>

				<div className='flex gap-4 items-center justify-end'>
					<div className='flex items-center gap-3'>
						<div className={`w-[39px] h-[4px] rounded-[6px] ${!role ? 'bg-brand' : 'bg-brand/40'}`}></div>
						<div className={`w-[39px] h-[4px] rounded-[6px] ${role && step !== 2 ? 'bg-brand' : 'bg-brand/40'}`}></div>
						{role === RoleEnum.CARRIER && <div className={`w-[39px] h-[4px] rounded-[6px] ${step === 2 ? 'bg-brand' : 'bg-brand/40'}`}></div>}
					</div>
				</div>
			</div>
		</div>
	)
}
