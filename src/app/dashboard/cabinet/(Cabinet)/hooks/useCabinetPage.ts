import { useGetAnalytics } from '@/hooks/queries/me/useGetAnalytics'
import { useGetMe } from '@/hooks/queries/me/useGetMe'
import { useSendEmailVerifyFromProfile } from '@/hooks/queries/me/useSendEmailVerifyFromProfile'
import { useUpdateMe } from '@/hooks/queries/me/useUpdateMe'
import { useVerifyEmailFromProfile } from '@/hooks/queries/me/useVerifyEmailFromProfile'
import { useLogout } from '@/hooks/useLogout'
import { useI18n } from '@/i18n/I18nProvider'
import { authService } from '@/services/auth/auth.service'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useMutation } from '@tanstack/react-query'
import { BarChart3, DoorOpen, Star, Truck } from 'lucide-react'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { getFallbackIncomeChartData, getIncomeChartConfig, getTransportChartConfig } from '../constants/charts'
import { isValueMissing } from '../guards/profileGuards'
import { formatTrend, getLocaleTag } from '../lib/cabinetFormatters'
import type { AnalyticsCard, IncomeChartDatum, ProfileField, TransportChartDatum } from '../types/cabinet'

type AnalyticsBarChart = {
	labels?: string[]
	given?: number[]
	received?: number[]
	earned?: number[]
}

export function useCabinetPage() {
	const { t, locale } = useI18n()
	const { me, isLoading } = useGetMe()
	const { logout, isLoading: isLoadingLogout } = useLogout()
	const { updateMe, isLoadingUpdateMe } = useUpdateMe()
	const { sendEmailVerify, isLoading: isResendingVerify } = useSendEmailVerifyFromProfile()
	const { verifyEmail, isLoading: isVerifyingEmail } = useVerifyEmailFromProfile()
	const { analytics, isLoading: isLoadingAnalytics } = useGetAnalytics()
	const [isRevenueOpen, setIsRevenueOpen] = useState(false)
	const [isTransportOpen, setIsTransportOpen] = useState(false)
	const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
	const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false)
	const [pendingPhone, setPendingPhone] = useState<string | null>(null)

	const localeTag = getLocaleTag(locale)
	const integerFormatter = useMemo(() => new Intl.NumberFormat(localeTag), [localeTag])
	const decimalFormatter = useMemo(
		() => new Intl.NumberFormat(localeTag, { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
		[localeTag],
	)
	const fullDateFormatter = useMemo(
		() => new Intl.DateTimeFormat(localeTag, { day: 'numeric', month: 'long', year: 'numeric' }),
		[localeTag],
	)

	const transportChartConfig = useMemo(() => getTransportChartConfig(t), [t])
	const incomeChartConfig = useMemo(() => getIncomeChartConfig(t), [t])
	const fallbackIncomeChartData = useMemo(() => getFallbackIncomeChartData(t), [t])

	const fallbackValue = '-'
	const registrationValue = analytics ? fullDateFormatter.format(new Date(analytics.registered_since)) : fallbackValue
	const ratingValue = analytics ? decimalFormatter.format(analytics.rating) : fallbackValue
	const distanceValue = analytics
		? `${integerFormatter.format(Math.round(analytics.distance_km))} ${t('cabinet.unit.km')}`
		: fallbackValue
	const dealsCount = analytics?.deals_count ?? 0
	const averagePriceValue = fallbackValue
	const ratingTrend = formatTrend(analytics?.successful_deliveries_change, decimalFormatter)

	const analyticsBarChart = analytics?.bar_chart as AnalyticsBarChart | undefined
	const barChartLabels = Array.isArray(analyticsBarChart?.labels) ? analyticsBarChart.labels : []
	const hasBarChartLabels = barChartLabels.length > 0
	const incomeChartData: IncomeChartDatum[] = hasBarChartLabels
		? barChartLabels.map((label, index) => ({
				month: label,
				given: analyticsBarChart?.given?.[index] ?? 0,
				received: analyticsBarChart?.received?.[index] ?? 0,
				earned: analyticsBarChart?.earned?.[index] ?? 0,
			}))
		: fallbackIncomeChartData

	const pieChart = analytics?.pie_chart as
		| {
				in_search?: number
				in_process?: number
				successful?: number
				cancelled?: number
				total?: number
		  }
		| undefined
	const queued = pieChart?.in_search ?? 0
	const inProgress = pieChart?.in_process ?? 0
	const completed = pieChart?.successful ?? 0
	const cancelled = pieChart?.cancelled ?? 0

	const transportChartData: TransportChartDatum[] = [
		{ status: 'search', label: t('cabinet.transport.search'), value: queued, fill: 'var(--color-search)' },
		{ status: 'progress', label: t('cabinet.transport.progress'), value: inProgress, fill: 'var(--color-progress)' },
		{ status: 'success', label: t('cabinet.transport.success'), value: completed, fill: 'var(--color-success)' },
		{ status: 'cancelled', label: t('cabinet.transport.cancelled'), value: cancelled, fill: 'var(--color-cancelled)' },
	]

	const totalTransports = pieChart?.total ?? transportChartData.reduce((sum, item) => sum + item.value, 0)

	const detailCards: AnalyticsCard[] = [
		{
			id: 'registration',
			title: t('cabinet.detail.registered'),
			value: registrationValue,
			description: analytics ? t('cabinet.detail.days', { count: analytics.days_since_registered }) : undefined,
			icon: DoorOpen,
			accentClass: 'text-indigo-600 bg-indigo-100',
		},
		{
			id: 'price-per-km',
			title: t('cabinet.detail.avgPrice'),
			value: averagePriceValue,
			trend: ratingTrend,
			trendVariant: (analytics?.successful_deliveries_change ?? 0) < 0 ? 'danger' : 'success',
			trendLabel: analytics ? t('cabinet.detail.trendFromLastMonth') : undefined,
			icon: BarChart3,
			accentClass: 'text-blue-600 bg-blue-100',
		},
		{
			id: 'rating',
			title: t('cabinet.detail.rating'),
			value: ratingValue,
			trend: ratingTrend,
			trendVariant: (analytics?.successful_deliveries_change ?? 0) < 0 ? 'danger' : 'success',
			trendLabel: analytics ? t('cabinet.detail.trendFromLastMonth') : undefined,
			description: analytics ? t('cabinet.detail.dealsBy', { count: integerFormatter.format(dealsCount) }) : undefined,
			icon: Star,
			accentClass: 'text-amber-500 bg-amber-50',
		},
		{
			id: 'distance',
			title: t('cabinet.detail.distance'),
			value: distanceValue,
			description: analytics ? t('cabinet.detail.dealsFor', { count: integerFormatter.format(dealsCount) }) : undefined,
			icon: Truck,
			accentClass: 'text-sky-600 bg-sky-100',
		},
	]

	const emailValue = me?.email ?? ''
	const isEmailMissing = isValueMissing(emailValue)
	const isEmailVerified = me?.is_email_verified ?? true
	const shouldShowEmailActions = isEmailMissing || !isEmailVerified
	const phoneValue = me?.phone ?? ''
	const isPhoneMissing = isValueMissing(phoneValue)

	const { mutate: sendPhoneOtp, isPending: isSendingPhoneOtp } = useMutation({
		mutationKey: ['send phone otp', 'cabinet'],
		mutationFn: (phone: string) => authService.sendPhoneOtp({ phone, purpose: 'verify' }),
		onSuccess: (_data, phone) => {
			setPendingPhone(phone)
			toast.success(t('cabinet.profile.phoneOtpSent'))
		},
		onError: (error) => {
			const message = getErrorMessage(error) ?? t('cabinet.profile.phoneOtpError')
			toast.error(message)
		},
	})

	const { mutate: verifyPhoneOtp, isPending: isVerifyingPhoneOtp } = useMutation({
		mutationKey: ['verify phone otp', 'cabinet'],
		mutationFn: (payload: { phone: string; code: string }) =>
			authService.verifyPhoneOtp({ phone: payload.phone, code: payload.code, purpose: 'verify' }),
		onSuccess: (data, variables) => {
			if (!data.verified) {
				toast.error(t('cabinet.profile.phoneOtpInvalid'))
				return
			}
			setPendingPhone(null)
			updateMe({ phone: variables.phone })
			setIsPhoneModalOpen(false)
			toast.success(t('cabinet.profile.phoneOtpVerified'))
		},
		onError: (error) => {
			const message = getErrorMessage(error) ?? t('cabinet.profile.phoneOtpVerifyError')
			toast.error(message)
		},
	})

	const profileFields: ProfileField[] = [
		{
			id: 'full-name',
			label: t('cabinet.profile.fullName'),
			value: me?.first_name || me?.company_name || me?.email || '',
		},
		{ id: 'company', label: t('cabinet.profile.company'), value: me?.company_name || '' },
		{ id: 'country', label: t('cabinet.profile.country'), value: me?.profile?.country || '' },
		{ id: 'city', label: t('cabinet.profile.city'), value: me?.profile?.city || '' },
	]

	const handleEmailSendCode = (nextEmail: string) => {
		if (!nextEmail) {
			toast.error(t('cabinet.profile.emailRequired'))
			return
		}
		sendEmailVerify({ email: nextEmail })
	}

	const handleEmailVerifyCode = (code: string) => {
		if (!code) {
			toast.error(t('cabinet.profile.emailRequired'))
			return
		}
		verifyEmail(
			{ code },
			{
				onSuccess: () => setIsEmailModalOpen(false),
			},
		)
	}

	const handlePhoneSendCode = (nextPhone: string) => {
		if (!nextPhone) {
			toast.error(t('cabinet.profile.phoneRequired'))
			return
		}
		sendPhoneOtp(nextPhone)
	}

	const handlePhoneVerifyCode = ({ phone, code }: { phone: string; code: string }) => {
		if (!phone) {
			toast.error(t('cabinet.profile.phoneRequired'))
			return
		}
		if (!code || code.trim().length < 6) {
			toast.error(t('cabinet.profile.phoneOtpRequired'))
			return
		}
		if (pendingPhone && pendingPhone.trim() !== phone.trim()) {
			setPendingPhone(phone)
		}
		verifyPhoneOtp({ phone, code })
	}

	const handlePhoneModalOpenChange = (nextOpen: boolean) => {
		setIsPhoneModalOpen(nextOpen)
		if (!nextOpen) setPendingPhone(null)
	}

	return {
		t,
		me,
		isLoading,
		logout,
		isLoadingLogout,
		isLoadingUpdateMe,
		isLoadingAnalytics,
		isRevenueOpen,
		setIsRevenueOpen,
		isTransportOpen,
		setIsTransportOpen,
		isEmailModalOpen,
		setIsEmailModalOpen,
		isPhoneModalOpen,
		handlePhoneModalOpenChange,
		emailValue,
		isEmailVerified,
		shouldShowEmailActions,
		phoneValue,
		isPhoneMissing,
		isResendingVerify,
		isVerifyingEmail,
		isSendingPhoneOtp,
		isVerifyingPhoneOtp,
		profileFields,
		detailCards,
		integerFormatter,
		incomeChartConfig,
		incomeChartData,
		transportChartConfig,
		transportChartData,
		totalTransports,
		handleEmailSendCode,
		handleEmailVerifyCode,
		handlePhoneSendCode,
		handlePhoneVerifyCode,
	}
}
