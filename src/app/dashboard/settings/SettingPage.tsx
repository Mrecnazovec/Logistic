"use client"

import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/form-control/Input'
import { Label } from '@/components/ui/form-control/Label'
import { CitySelector } from '@/components/ui/selectors/CitySelector'
import { useGetMe } from '@/hooks/queries/me/useGetMe'
import { useUpdateMe } from '@/hooks/queries/me/useUpdateMe'
import { useI18n } from '@/i18n/I18nProvider'
import { type UpdateMeDto } from '@/shared/types/Me.interface'

const toPayload = (values: UpdateMeDto): UpdateMeDto => ({
    first_name: values.first_name?.trim() || undefined,
    company_name: values.company_name?.trim() || undefined,
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

    const { register, handleSubmit, reset, setValue, control } = useForm<UpdateMeDto>({
        defaultValues: {
            first_name: '',
            company_name: '',
            profile: { country: '', country_code: '', city: '' },
        },
    })

    const watchedCountryCode = useWatch({ control, name: 'profile.country_code' })
    const watchedCity = useWatch({ control, name: 'profile.city' }) || ''
    const watchedCountryName = useWatch({ control, name: 'profile.country' }) || ''

    useEffect(() => {
        if (!me) return
        reset({
            first_name: me.first_name ?? '',
            company_name: me.company_name ?? '',
            profile: {
                country: me.profile?.country ?? '',
                country_code: me.profile?.country_code ?? '',
                city: me.profile?.city ?? '',
                region: me.profile?.region,
            },
        })
    }, [me, reset])

    const onSubmit = handleSubmit((values) => {
        updateMe(toPayload(values))
    })

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

                <div className='flex justify-end'>
                    <Button
                        type='submit'
                        disabled={isLoadingUpdateMe}
                        className='h-11 rounded-full bg-success-500 px-6 text-sm font-medium text-white hover:bg-success-400 disabled:opacity-80'
                    >
                        {t('settings.profile.save')}
                    </Button>
                </div>
            </div>
        </form>
    )
}
