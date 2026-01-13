"use client"

import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/InputOTP'
import { Input } from '@/components/ui/form-control/Input'
import { Label } from '@/components/ui/form-control/Label'
import { CitySelector } from '@/components/ui/selectors/CitySelector'
import { useGetMe } from '@/hooks/queries/me/useGetMe'
import { useUpdateMe } from '@/hooks/queries/me/useUpdateMe'
import { useI18n } from '@/i18n/I18nProvider'
import { authService } from '@/services/auth/auth.service'
import { type UpdateMeDto } from '@/shared/types/Me.interface'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

const toPayload = (values: UpdateMeDto): UpdateMeDto => ({
    first_name: values.first_name?.trim() || undefined,
    company_name: values.company_name?.trim() || undefined,
    phone: values.phone?.trim() || undefined,
    profile: {
        country: values.profile?.country?.trim() || undefined,
        city: values.profile?.city?.trim() || undefined,
        region: values.profile?.region,
        country_code: values.profile?.country_code,
    },
})

export function SettingPage() {
    const { t } = useI18n()
    const { me, isLoading } = useGetMe()
    const { updateMe, isLoadingUpdateMe } = useUpdateMe()
    const [pendingValues, setPendingValues] = useState<UpdateMeDto | null>(null)

    const { register, handleSubmit, reset, setValue, control } = useForm<UpdateMeDto>({
        defaultValues: {
            first_name: '',
            company_name: '',
            phone: '',
            profile: { country: '', country_code: '', city: '' },
        },
    })

    const watchedCountryCode = useWatch({ control, name: 'profile.country_code' })
    const watchedCity = useWatch({ control, name: 'profile.city' }) || ''
    const watchedCountryName = useWatch({ control, name: 'profile.country' }) || ''
    const watchedPhone = useWatch({ control, name: 'phone' }) || ''

    const [otpCode, setOtpCode] = useState('')
    const [pendingPhone, setPendingPhone] = useState<string | null>(null)
    const [verifiedPhone, setVerifiedPhone] = useState<string | null>(null)

    useEffect(() => {
        if (!me) return
        reset({
            first_name: me.first_name ?? '',
            company_name: me.company_name ?? '',
            phone: me.phone ?? '',
            profile: {
                country: me.profile?.country ?? '',
                country_code: me.profile?.country_code ?? '',
                city: me.profile?.city ?? '',
                region: me.profile?.region,
            },
        })
    }, [me, reset])

    const activePendingPhone = pendingPhone && pendingPhone.trim() === watchedPhone.trim() ? pendingPhone : null

    const { mutateAsync: sendPhoneOtp, isPending: isSendingOtp } = useMutation({
        mutationKey: ['send phone otp', 'settings'],
        mutationFn: (phone: string) => authService.sendPhoneOtp({ phone, purpose: 'verify' }),
        onSuccess: (_data, phone) => {
            setPendingPhone(phone)
            setOtpCode('')
            toast.success(t('settings.profile.phone.otpSent'))
        },
        onError: (error) => {
            const message = getErrorMessage(error) ?? t('settings.profile.phone.otpError')
            toast.error(message)
        },
    })

    const { mutateAsync: verifyPhoneOtp, isPending: isVerifyingOtp } = useMutation({
        mutationKey: ['verify phone otp', 'settings'],
        mutationFn: (payload: { phone: string; code: string }) =>
            authService.verifyPhoneOtp({ phone: payload.phone, code: payload.code, purpose: 'verify' }),
        onSuccess: (data, variables) => {
            if (!data.verified) {
                toast.error(t('settings.profile.phone.otpInvalid'))
                return
            }
            setVerifiedPhone(variables.phone)
            setPendingPhone(null)
            setOtpCode('')
            if (pendingValues) {
                updateMe(pendingValues)
                setPendingValues(null)
            }
            toast.success(t('settings.profile.phone.otpVerified'))
        },
        onError: (error) => {
            const message = getErrorMessage(error) ?? t('settings.profile.phone.otpVerifyError')
            toast.error(message)
        },
    })

    const onSubmit = handleSubmit(async (values) => {
        const nextPhone = values.phone?.trim() ?? ''
        const currentPhone = me?.phone?.trim() ?? ''
        const isPhoneChanged = nextPhone !== currentPhone
        const isPhoneVerified = nextPhone === currentPhone || verifiedPhone?.trim() === nextPhone

        if (isPhoneChanged && nextPhone.length === 0) {
            toast.error(t('settings.profile.phone.required'))
            return
        }

        if (pendingPhone && pendingPhone.trim() !== nextPhone) {
            setPendingPhone(null)
            setOtpCode('')
            setPendingValues(null)
        }

        if (verifiedPhone && verifiedPhone.trim() !== nextPhone) {
            setVerifiedPhone(null)
        }

        if (isPhoneChanged && !isPhoneVerified) {
            setPendingValues(toPayload(values))
            await sendPhoneOtp(nextPhone)
            return
        }

        updateMe(toPayload(values))
    })

    const handleVerifyPhone = async () => {
        const phoneValue = activePendingPhone ?? watchedPhone.trim()
        if (!phoneValue) {
            toast.error(t('settings.profile.phone.required'))
            return
        }
        if (otpCode.trim().length < 6) {
            toast.error(t('settings.profile.phone.otpRequired'))
            return
        }
        await verifyPhoneOtp({ phone: phoneValue, code: otpCode })
    }

    return (
        <form onSubmit={onSubmit} className='rounded-[32px] bg-white p-6 shadow-sm md:p-8'>
            <div className='space-y-1'>
                <h1 className='text-xl font-semibold text-foreground md:text-2xl'>{t('settings.profile.title')}</h1>
                <p className='text-sm text-muted-foreground'>{t('settings.profile.description')}</p>
            </div>

            <div className='mt-8 space-y-6'>
                <div className='grid gap-5 md:grid-cols-2'>
                    <div className='space-y-2'>
                        <Label htmlFor='fullName' className='text-sm font-medium text-foreground'>{t('settings.profile.fullName.label')}</Label>
                        <Input
                            id='fullName'
                            placeholder={t('settings.profile.fullName.placeholder')}
                            disabled={isLoading || isLoadingUpdateMe}
                            className='rounded-full bg-grayscale-50 text-[15px] placeholder:text-muted-foreground/80'
                            {...register('first_name')}
                        />
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='companyName' className='text-sm font-medium text-foreground'>{t('settings.profile.companyName.label')}</Label>
                        <Input
                            id='companyName'
                            placeholder={t('settings.profile.companyName.placeholder')}
                            disabled={isLoading || isLoadingUpdateMe}
                            className='rounded-full bg-grayscale-50 text-[15px] placeholder:text-muted-foreground/80'
                            {...register('company_name')}
                        />
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='email' className='text-sm font-medium text-foreground'>{t('settings.profile.email.label')}</Label>
                        <Input
                            id='email'
                            placeholder={t('settings.profile.email.placeholder')}
                            value={me?.email ?? ''}
                            disabled
                            className='rounded-full bg-grayscale-50 text-[15px] placeholder:text-muted-foreground/80 disabled:opacity-100'
                        />
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='phone' className='text-sm font-medium text-foreground'>{t('settings.profile.phone.label')}</Label>
                        <Input
                            id='phone'
                            placeholder={t('settings.profile.phone.placeholder')}
                            disabled={isLoading || isLoadingUpdateMe || isSendingOtp || isVerifyingOtp}
                            className='rounded-full bg-grayscale-50 text-[15px] placeholder:text-muted-foreground/80'
                            {...register('phone')}
                        />
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='city' className='text-sm font-medium text-foreground'>{t('settings.profile.city.label')}</Label>
                        <CitySelector
                            value={watchedCity}
                            onChange={(value, city) => {
                                setValue('profile.city', value)
                                if (city?.country_code) {
                                    setValue('profile.country', city.country)
                                    setValue('profile.country_code', city.country_code)
                                }
                            }}
                            countryName={watchedCountryName}
                            countryCode={watchedCountryCode || undefined}
                            disabled={isLoading || isLoadingUpdateMe}
                            placeholder={t('settings.profile.city.placeholder')}
                        />
                    </div>
                </div>

                {activePendingPhone ? (
                    <div className='rounded-3xl border border-dashed px-6 py-6 space-y-4'>
                        <div className='space-y-1'>
                            <p className='text-sm font-medium text-foreground'>{t('settings.profile.phone.otpTitle')}</p>
                            <p className='text-sm text-muted-foreground'>{t('settings.profile.phone.otpSubtitle', { phone: activePendingPhone })}</p>
                        </div>
                        <div className='flex justify-center'>
                            <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode}>
                                <InputOTPGroup>
                                    {Array.from({ length: 6 }).map((_, index) => (
                                        <InputOTPSlot key={`phone-otp-${index}`} index={index} />
                                    ))}
                                </InputOTPGroup>
                            </InputOTP>
                        </div>
                        <div className='flex flex-wrap items-center justify-between gap-3'>
                            <Button
                                type='button'
                                variant='outline'
                                disabled={isSendingOtp || isVerifyingOtp}
                                onClick={() => activePendingPhone && sendPhoneOtp(activePendingPhone)}
                            >
                                {t('settings.profile.phone.otpResend')}
                            </Button>
                            <Button
                                type='button'
                                disabled={isSendingOtp || isVerifyingOtp || otpCode.trim().length < 6}
                                onClick={handleVerifyPhone}
                            >
                                {t('settings.profile.phone.otpConfirm')}
                            </Button>
                        </div>
                    </div>
                ) : null}

                <div className='flex justify-end'>
                    <Button
                        type='submit'
                        disabled={isLoadingUpdateMe || isSendingOtp || isVerifyingOtp}
                        className='h-11 rounded-full bg-success-500 px-6 text-sm font-medium text-white hover:bg-success-400 disabled:opacity-80'
                    >
                        {t('settings.profile.save')}
                    </Button>
                </div>
            </div>
        </form>
    )
}
