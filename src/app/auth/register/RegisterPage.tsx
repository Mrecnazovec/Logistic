'use client'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Form } from '@/components/ui/form-control/Form'
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { IMG_URL, PUBLIC_URL } from '@/config/url.config'
import { SITE_NAME } from '@/constants/seo.constants'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { RegisterAuthFields } from './RegisterField'
import { useRegisterForm } from './useRegisterForm'

import { AsCargoSaver } from '@/app/svg/AsCargoSaver'
import LogistIcon from '@/app/svg/LogistIcon'
import TruckIcon from '@/app/svg/TruckIcon'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/InputOTP'
import { authService } from '@/services/auth/auth.service'
import { RoleEnum } from '@/shared/enums/Role.enum'
import { RegisterDto } from '@/shared/types/Registration.interface'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { RegisterCompanyFields, RegisterTransportField, RegisterVehicleFields } from './RegisterCarrier'
import { RegisterRoles } from './RegisterRoles'

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

const AUTH_FIELDS = ['email', 'password', 'password2'] as const
const COMPANY_FIELDS = ['first_name', 'phone', 'country', 'country_code', 'city', 'company_name'] as const
const VEHICLE_FIELDS = ['car_number', 'trailer_number', 'driver_license'] as const

export function RegisterPage() {
	const { form, isPending, onSubmit } = useRegisterForm()
	const searchParams = useSearchParams()
	const nextParam = searchParams.get('next')
	const authHref = nextParam ? `${PUBLIC_URL.auth()}?next=${encodeURIComponent(nextParam)}` : PUBLIC_URL.auth()

	const [role, setRole] = useState<RoleEnum>()
	const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1)
	const [otpCode, setOtpCode] = useState('')
	const [otpSecondsLeft, setOtpSecondsLeft] = useState<number | null>(null)
	const transportName = form.watch('transport_name') ?? ''
	const hasTransportName = transportName.trim().length > 0

	const baseSteps = useMemo(() => {
		if (!role) return 2
		return role === RoleEnum.CARRIER && hasTransportName ? 3 : 2
	}, [role, hasTransportName])

	const totalSteps = role ? baseSteps + 2 : 2

	const currentStepIndex = useMemo(() => {
		if (!role) return step
		if (step <= baseSteps) return step
		return baseSteps + (step === 4 ? 1 : 2)
	}, [step, baseSteps, role])

	const phoneValue = form.watch('phone') ?? ''

	const { mutateAsync: sendPhoneOtp, isPending: isSendingOtp } = useMutation({
		mutationKey: ['send phone otp'],
		mutationFn: (phone: string) => authService.sendPhoneOtp({ phone, purpose: 'verify' }),
		onSuccess: (data) => {
			setOtpSecondsLeft(data.seconds_left ?? 0)
			setStep(4)
			setOtpCode('')
		},
		onError: (error) => {
			const message = getErrorMessage(error) ?? 'Не удалось отправить код подтверждения'
			toast.error(message)
		},
	})

	const { mutateAsync: verifyPhoneOtp, isPending: isVerifyingOtp } = useMutation({
		mutationKey: ['verify phone otp'],
		mutationFn: (payload: { phone: string; code: string }) =>
			authService.verifyPhoneOtp({ phone: payload.phone, code: payload.code, purpose: 'verify' }),
		onSuccess: (data) => {
			if (data.verified) {
				setStep(5)
				return
			}
			toast.error('Код подтверждения неверный')
		},
		onError: (error) => {
			const message = getErrorMessage(error) ?? 'Не удалось подтвердить код'
			toast.error(message)
		},
	})

	const handleTransportChange = (value: string) => {
		if (step === 3 && value.trim().length === 0) {
			setStep(2)
		}
	}

	const scrollToFirstError = () => {
		const firstErrorField = Object.keys(form.formState.errors)[0]
		if (firstErrorField) {
			const element = document.querySelector(`[name="${firstErrorField}"]`)
			element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
		}
	}

	const handleBack = () => {
		if (step === 2) {
			setStep(1)
			return
		}

		if (step === 3) {
			setStep(2)
			return
		}

		if (step === 4) {
			setStep(role === RoleEnum.CARRIER && hasTransportName ? 3 : 2)
			return
		}

		if (step === 5) {
			setStep(4)
		}
	}

	const handleBackToRole = () => {
		setRole(undefined)
		setStep(1)
	}

	const handleNext = async () => {
		if (!role) {
			return
		}

		let fields: readonly (keyof RegisterDto)[] = AUTH_FIELDS

		if (step === 2) {
			fields = [...AUTH_FIELDS, ...COMPANY_FIELDS]
		} else if (step === 3) {
			fields = [...AUTH_FIELDS, ...COMPANY_FIELDS, ...VEHICLE_FIELDS]
		}

		const isValid = await form.trigger(fields)
		if (!isValid) {
			scrollToFirstError()
			return
		}

		if (step === 1) {
			setStep(2)
			return
		}

		if (step === 2 && role === RoleEnum.CARRIER && hasTransportName) {
			setStep(3)
			return
		}

		const phone = form.getValues('phone')
		if (!phone) {
			form.setError('phone', { message: 'Введите номер телефона' })
			scrollToFirstError()
			return
		}

		try {
			await sendPhoneOtp(phone)
		} catch {
			return
		}
	}

	const handleVerifyOtp = async () => {
		if (!phoneValue) {
			toast.error('Введите номер телефона')
			return
		}

		if (otpCode.trim().length < 6) {
			toast.error('Введите код подтверждения')
			return
		}

		try {
			await verifyPhoneOtp({ phone: phoneValue, code: otpCode })
		} catch {
			return
		}
	}

	const handleRegister = () => {
		if (!role) {
			return
		}

		onSubmit({
			...form.getValues(),
			role,
		})
	}

	const handleResendOtp = async () => {
		if (!phoneValue) {
			toast.error('Введите номер телефона')
			return
		}

		try {
			await sendPhoneOtp(phoneValue)
		} catch {
			return
		}
	}

	const formatCountdown = (seconds: number) => {
		const minutes = Math.floor(seconds / 60)
		const restSeconds = seconds % 60
		return `${minutes}:${String(restSeconds).padStart(2, '0')}`
	}

	useEffect(() => {
		if (!otpSecondsLeft || otpSecondsLeft <= 0) return

		const timer = setInterval(() => {
			setOtpSecondsLeft((prev) => (prev && prev > 0 ? prev - 1 : 0))
		}, 1000)

		return () => clearInterval(timer)
	}, [otpSecondsLeft])

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
						<Link href={authHref}>
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
							<h1 className='sm:text-5xl text-4xl font-bold text-center'>
								{!role
									? 'Регистрация'
									: step === 1
										? 'Регистрация'
										: step === 2 || step === 3
											? 'Информация о компании'
											: 'Подтверждение'}
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
								{/* <Button className='mx-auto block' variant={'link'}>
									Что такое роли?
								</Button> */}
							</CardContent>
						) : (
							<Form {...form}>
								<form
									onSubmit={(event) => {
										event.preventDefault()
										void handleNext()
									}}
								>
									<CardContent>
										{step === 1 && (
											<>
												<RegisterAuthFields form={form} isPending={isPending} />
												<div className='flex items-center gap-4'>
													<Button type='button' variant={'outline'} disabled={isPending} onClick={handleBackToRole}>
														Назад
													</Button>
													<Button type='button' className='flex-1' disabled={isPending} onClick={handleNext}>
														Продолжить
													</Button>
												</div>
											</>
										)}
										{step === 2 && (
											<>
												<RegisterCompanyFields form={form} isPending={isPending} />
												{role === RoleEnum.CARRIER && (
													<RegisterTransportField form={form} isPending={isPending} onChange={handleTransportChange} />
												)}
												<div className='flex items-center gap-4'>
													<Button type='button' variant={'outline'} disabled={isPending || isSendingOtp} onClick={handleBack}>
														Назад
													</Button>
													<Button
														type='button'
														className='flex-1'
														disabled={isPending || isSendingOtp}
														onClick={handleNext}
													>
														Продолжить
													</Button>
												</div>
											</>
										)}
										{step === 3 && role === RoleEnum.CARRIER && hasTransportName && (
											<>
												<RegisterVehicleFields form={form} isPending={isPending} showTransportName={false} />
												<div className='flex items-center gap-4'>
													<Button type='button' variant={'outline'} disabled={isPending || isSendingOtp} onClick={handleBack}>
														Назад
													</Button>
													<Button
														type='button'
														className='flex-1'
														disabled={isPending || isSendingOtp}
														onClick={handleNext}
													>
														Продолжить
													</Button>
												</div>
											</>
										)}
										{step === 4 && (
											<div className='space-y-8'>
												<p className='text-center text-muted-foreground'>
													Мы только что отправили проверочный код на{' '}
													<span className='text-brand font-semibold'>{phoneValue || 'ваш телефон'}</span>
												</p>
												<div className='flex justify-center'>
													<InputOTP maxLength={6} value={otpCode} onChange={setOtpCode}>
														<InputOTPGroup>
															{Array.from({ length: 6 }).map((_, index) => (
																<InputOTPSlot key={`otp-slot-${index}`} index={index} />
															))}
														</InputOTPGroup>
													</InputOTP>
												</div>
												<div className='text-center text-sm text-muted-foreground'>
													{otpSecondsLeft && otpSecondsLeft > 0 ? (
														<p>Через {formatCountdown(otpSecondsLeft)} можно отправить код еще раз</p>
													) : (
														<button
															type='button'
															className='text-brand font-semibold'
															disabled={isSendingOtp}
															onClick={handleResendOtp}
														>
															Отправить код еще раз
														</button>
													)}
												</div>
												<div className='flex items-center gap-4'>
													<Button
														type='button'
														variant={'outline'}
														disabled={isVerifyingOtp || isSendingOtp}
														onClick={handleBack}
													>
														Назад
													</Button>
													<Button
														type='button'
														className='flex-1'
														disabled={isVerifyingOtp || isSendingOtp || otpCode.length < 6}
														onClick={handleVerifyOtp}
													>
														Подтвердить
													</Button>
												</div>

											</div>
										)}
										{step === 5 && (
											<div className='space-y-6 text-center'>
												<p className='text-muted-foreground'>
													Номер телефона подтверждён, вы можете завершить регистрацию.
												</p>
												<Button type='button' className='w-full' disabled={isPending} onClick={handleRegister}>
													Зарегистрироваться
												</Button>
												<Button type='button' variant={'outline'} disabled={isPending} onClick={handleBack}>
													Назад
												</Button>
											</div>
										)}
									</CardContent>
								</form>
							</Form>
						)}
					</Card>
				</div>

				<div className='flex gap-4 items-center justify-end'>
					<div className='flex items-center gap-3'>
						{Array.from({ length: totalSteps }).map((_, index) => (
							<div
								key={`register-step-${index + 1}`}
								className={`w-[39px] h-[4px] rounded-[6px] ${currentStepIndex === index + 1 ? 'bg-brand' : 'bg-brand/40'}`}
							></div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
