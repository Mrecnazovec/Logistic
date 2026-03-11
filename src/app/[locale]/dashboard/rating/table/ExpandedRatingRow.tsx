'use client'

import { ProfileLink } from '@/components/ui/actions/ProfileLink'
import { RoleSelect } from '@/shared/enums/Role.enum'
import { IRatingUserList } from '@/shared/types/Rating.interface'
import { format } from 'date-fns'
import { enUS, ru } from 'date-fns/locale'
import { useI18n } from '@/i18n/I18nProvider'

const formatNumber = (value?: number | string | null, numberLocale?: string) => {
	if (value === null || value === undefined) return '-'

	const numericValue = typeof value === 'string' ? Number(value) : value
	if (!Number.isFinite(numericValue)) return '-'

	return numericValue.toLocaleString(numberLocale ?? 'ru-RU')
}

export function ExpandedRatingRow({ user }: { user: IRatingUserList }) {
	const { t, locale } = useI18n()
	const numberLocale = locale === 'en' ? 'en-US' : 'ru-RU'
	const dateLocale = locale === 'en' ? enUS : ru

	const registeredAt = user.registered_at
		? format(new Date(user.registered_at), 'dd.MM.yyyy', { locale: dateLocale })
		: '-'
	const toNumber = (value?: number | string | null) => {
		if (value === null || value === undefined) return null
		const numericValue = typeof value === 'string' ? Number(value) : value
		return Number.isFinite(numericValue) ? numericValue : null
	}
	const avgRatingNumber = toNumber(user.avg_rating)
	const avgRatingValue = avgRatingNumber !== null ? avgRatingNumber.toFixed(1) : '-'
	const ratingCount = formatNumber(user.rating_count, numberLocale)

	const stats = [
		{
			label: t('rating.expanded.rating'),
			value: `${avgRatingValue !== '-' ? avgRatingValue : '-'} / ${ratingCount !== '-' ? ratingCount : '-'} ${t('rating.expanded.reviewsSuffix')}`,
		},
		{
			label: t('rating.expanded.completed'),
			value: formatNumber(user.completed_orders, numberLocale),
		},
		{
			label: t('rating.expanded.distance'),
			value: formatNumber(user.total_distance, numberLocale),
		},
		{
			label: t('rating.expanded.registeredAt'),
			value: registeredAt,
		},
	]

	return (
		<div className='grid gap-6 md:grid-cols-2'>
			<div className='space-y-3'>
				<div>
					<p className='text-sm text-muted-foreground'>{t('rating.expanded.company')}</p>
					<p className='text-base font-semibold text-foreground'>{user.company_name ?? '-'}</p>
				</div>
				<div>
					<p className='text-sm text-muted-foreground'>{t('rating.expanded.person')}</p>
					<p className='text-base font-medium text-foreground'>{<ProfileLink id={user.id} name={user.display_name} />}</p>
				</div>
				<div>
					<p className='text-sm text-muted-foreground'>{t('rating.expanded.role')}</p>
					<p className='text-base font-medium text-foreground'>
						{t(RoleSelect.find((type) => type.type === user.role)?.nameKey ?? '')}
					</p>
				</div>
				<div>
					<p className='text-sm text-muted-foreground'>{t('rating.expanded.country')}</p>
					<p className='text-base font-medium text-foreground'>{user.country ?? '-'}</p>
				</div>
			</div>

			<div className='grid gap-3 sm:grid-cols-2'>
				{stats.map((item) => (
					<div key={item.label} className='rounded-3xl bg-muted p-4'>
						<p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>{item.label}</p>
						<p className='text-lg font-semibold text-foreground'>{item.value}</p>
					</div>
				))}
			</div>
		</div>
	)
}
