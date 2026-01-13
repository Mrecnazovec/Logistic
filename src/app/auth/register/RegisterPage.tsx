'use client'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Form } from '@/components/ui/form-control/Form'
import { LanguageSelect } from '@/components/ui/LanguageSelect'
import { PUBLIC_URL } from '@/config/url.config'
import { SITE_NAME } from '@/constants/seo.constants'
import { useI18n } from '@/i18n/I18nProvider'
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
import { Logo } from '@/components/ui/Logo'

const AUTH_FIELDS = ['username', 'password', 'password2'] as const
const COMPANY_FIELDS = ['first_name', 'phone', 'country', 'country_code', 'city', 'company_name'] as const
const VEHICLE_FIELDS = ['car_number', 'trailer_number', 'driver_license'] as const

export function RegisterPage() {
	const { t } = useI18n()
	const { form, isPending, onSubmit } = useRegisterForm()
	const searchParams = useSearchParams()
	const nextParam = searchParams.get('next')
	const authHref = nextParam ? `${PUBLIC_URL.auth()}?next=${encodeURIComponent(nextParam)}` : PUBLIC_URL.auth()

	const [role, setRole] = useState<RoleEnum>()
	const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1)
	const [otpCode, setOtpCode] = useState('')
	const [otpSecondsLeft, setOtpSecondsLeft] = useState<number | null>(null)
	const [verifiedPhone, setVerifiedPhone] = useState<string | null>(null)
	const transportName = form.watch('transport_name') ?? ''
	const hasTransportName = transportName.trim().length > 0
	const phoneValue = form.watch('phone') ?? ''

	const roles = useMemo(
		() => [
			{
				key: RoleEnum.CUSTOMER,
				title: t('register.role.customer.title'),
				icon: AsCargoSaver,
				color: '#1E3A8A',
				description: t('register.role.customer.description'),
				buttonText: t('register.role.customer.button'),
			},
			{
				key: RoleEnum.CARRIER,
				title: t('register.role.carrier.title'),
				icon: TruckIcon,
				color: '#1E3A8A',
				description: t('register.role.carrier.description'),
				buttonText: t('register.role.carrier.button'),
			},
			{
				key: RoleEnum.LOGISTIC,
				title: t('register.role.logistic.title'),
				icon: LogistIcon,
				color: '#1E3A8A',
				description: t('register.role.logistic.description'),
				buttonText: t('register.role.logistic.button'),
			},
		],
		[t]
	)

	const baseSteps = useMemo(() => {
		if (!role) return 2
		return role === RoleEnum.CARRIER && hasTransportName ? 3 : 2
	}, [role, hasTransportName])

	const isPhoneVerified = verifiedPhone !== null && verifiedPhone === phoneValue
	const totalSteps = role ? baseSteps + (isPhoneVerified ? 1 : 2) : 2

	const currentStepIndex = useMemo(() => {
		if (!role) return step
		if (step <= baseSteps) return step
		if (isPhoneVerified) return baseSteps + 1
		return baseSteps + (step === 4 ? 1 : 2)
	}, [step, baseSteps, role, isPhoneVerified])

	const { mutateAsync: sendPhoneOtp, isPending: isSendingOtp } = useMutation({
		mutationKey: ['send phone otp'],
		mutationFn: (phone: string) => authService.sendPhoneOtp({ phone, purpose: 'verify' }),
		onSuccess: (data) => {
			setOtpSecondsLeft(data.seconds_left ?? 0)
			setStep(4)
			setOtpCode('')
		},
		onError: (error) => {
			const message = getErrorMessage(error) ?? t('register.errors.sendOtp')
			toast.error(message)
		},
	})

	const { mutateAsync: verifyPhoneOtp, isPending: isVerifyingOtp } = useMutation({
		mutationKey: ['verify phone otp'],
		mutationFn: (payload: { phone: string; code: string }) =>
			authService.verifyPhoneOtp({ phone: payload.phone, code: payload.code, purpose: 'verify' }),
		onSuccess: (data) => {
			if (data.verified) {
				setVerifiedPhone(phoneValue)
				setStep(5)
				return
			}
			toast.error(t('register.errors.invalidOtp'))
		},
		onError: (error) => {
			const message = getErrorMessage(error) ?? t('register.errors.verifyOtp')
			toast.error(message)
		},
	})

	const handleTransportChange = (value: string) => {
		if (step === 3 && value.trim().length === 0) {
			setStep(2)
		}
	}

	const handlePhoneChange = (value: string) => {
		if (verifiedPhone && value !== verifiedPhone) {
			setVerifiedPhone(null)
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
			if (isPhoneVerified) {
				setStep(role === RoleEnum.CARRIER && hasTransportName ? 3 : 2)
				return
			}
			setStep(4)
		}
	}

	const handleBackToRole = () => {
		setRole(undefined)
		setStep(1)
		setVerifiedPhone(null)
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

		if (isPhoneVerified) {
			setStep(5)
			return
		}

		const phone = form.getValues('phone')
		if (!phone) {
			form.setError('phone', { message: t('register.errors.phoneRequired') })
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
			toast.error(t('register.errors.phoneRequired'))
			return
		}

		if (otpCode.trim().length < 6) {
			toast.error(t('register.errors.otpRequired'))
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
			toast.error(t('register.errors.phoneRequired'))
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
			<h1 className='sr-only'>{t('register.title')}</h1>
			<div className='bg-[url(/png/bg_auth.png)] h-full flex lg:flex-col items-center justify-center bg-no-repeat bg-cover bg-bottom px-12 py-16 min-h-[200px]'>
				<div className='bg-brand-900 rounded-6xl lg:p-12 sm:p-6 p-3'>
					<Logo href='/' className='sm:mb-8 mb-4' imageClassName='sm:w-[122px]' />
					<h2 className='lg:text-[32px] sm:text-xl text-base text-white font-raleway font-semibold'>{t('auth.hero')}</h2>
				</div>
			</div>
			<div className='flex flex-col h-full sm:px-12 px-4 py-8'>
				<div className='flex sm:flex-row flex-col gap-4 items-center lg:justify-end justify-center'>
					<div className='flex items-center justify-center gap-2 flex-wrap'>
						<Link href={authHref}>
							<Button variant={'outline'} className='bg-accent border-none rounded-full text-[16px] hover:bg-accent/80 px-4 py-3 font-medium'>
								{t('auth.signIn')}
							</Button>
						</Link>
						<LanguageSelect />
					</div>
				</div>

				<div className='flex flex-1 items-center justify-center'>
					<Card className='w-full max-w-xl border-none bg-transparent shadow-none'>
						<CardHeader className='mb-6'>
							<h1 className='sm:text-5xl text-4xl font-bold text-center'>
								{!role ? t('register.title') : step === 1 ? t('register.title') : step === 2 || step === 3 ? t('register.companyInfo') : t('register.confirmation')}
							</h1>
							{!role && (
								<p className='text-center text-lg font-bold mt-6'>
									{t('register.welcomeTitle', { siteName: SITE_NAME })} <br /> {t('register.welcomeSubtitle')}
								</p>
							)}
						</CardHeader>

						{!role ? (
							<CardContent>
								<RegisterRoles roles={roles} onSelect={setRole} />
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
														{t('common.back')}
													</Button>
													<Button type='button' className='flex-1' disabled={isPending} onClick={handleNext}>
														{t('common.continue')}
													</Button>
												</div>
											</>
										)}
										{step === 2 && (
											<>
												<RegisterCompanyFields form={form} isPending={isPending} onPhoneChange={handlePhoneChange} />
												{role === RoleEnum.CARRIER && (
													<RegisterTransportField form={form} isPending={isPending} onChange={handleTransportChange} />
												)}
												<div className='flex items-center gap-4'>
													<Button type='button' variant={'outline'} disabled={isPending || isSendingOtp} onClick={handleBack}>
														{t('common.back')}
													</Button>
													<Button
														type='button'
														className='flex-1'
														disabled={isPending || isSendingOtp}
														onClick={handleNext}
													>
														{t('common.continue')}
													</Button>
												</div>
											</>
										)}
										{step === 3 && role === RoleEnum.CARRIER && hasTransportName && (
											<>
												<RegisterVehicleFields form={form} isPending={isPending} showTransportName={false} />
												<div className='flex items-center gap-4'>
													<Button type='button' variant={'outline'} disabled={isPending || isSendingOtp} onClick={handleBack}>
														{t('common.back')}
													</Button>
													<Button
														type='button'
														className='flex-1'
														disabled={isPending || isSendingOtp}
														onClick={handleNext}
													>
														{t('common.continue')}
													</Button>
												</div>
											</>
										)}
										{step === 4 && (
											<div className='space-y-8'>
												<p className='text-center text-muted-foreground'>
													{t('register.otpSent', { phone: phoneValue || t('register.yourPhone') })}
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
														<p>{t('register.resendIn', { time: formatCountdown(otpSecondsLeft) })}</p>
													) : (
														<button
															type='button'
															className='text-brand font-semibold'
															disabled={isSendingOtp}
															onClick={handleResendOtp}
														>
															{t('register.resendCode')}
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
														{t('common.back')}
													</Button>
													<Button
														type='button'
														className='flex-1'
														disabled={isVerifyingOtp || isSendingOtp || otpCode.length < 6}
														onClick={handleVerifyOtp}
													>
														{t('common.confirm')}
													</Button>
												</div>
											</div>
										)}
										{step === 5 && (
											<div className='space-y-6 text-center'>
												<p className='text-muted-foreground'>{t('register.phoneVerified')}</p>
												<Button type='button' className='w-full' disabled={isPending} onClick={handleRegister}>
													{t('register.finish')}
												</Button>
												<Button type='button' variant={'outline'} disabled={isPending} onClick={handleBack}>
													{t('common.back')}
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
