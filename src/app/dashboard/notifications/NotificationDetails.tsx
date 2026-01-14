"use client"

import { Button } from '@/components/ui/Button'
import {
	getNotificationDetailsModel,
	getNotificationRatedById,
	getNotificationRatedUserId,
} from '@/app/dashboard/notifications/notificationHelpers'
import { formatDateTimeValue } from '@/lib/formatters'
import type { INotification } from '@/shared/types/Notification.interface'
import { ProfileLink } from '@/components/ui/actions/ProfileLink'
import { Tag } from 'lucide-react'
import Link from 'next/link'
import { useI18n } from '@/i18n/I18nProvider'
import { useGetOffer } from '@/hooks/queries/offers/useGet/useGetOffer'
import { useGetMe } from '@/hooks/queries/me/useGetMe'
import { useGetRatingUser } from '@/hooks/queries/ratings/useGet/useGetRatingUser'

type NotificationDetailsProps = {
	notification: INotification
}

export function NotificationDetails({ notification }: NotificationDetailsProps) {
	const { t, locale } = useI18n()
	const isDealConfirm = notification.type === 'deal_confirm_required_by_other'
	const isOfferResponse = notification.type === 'offer_response_to_me'
	const offerId = isDealConfirm && notification.offer_id ? String(notification.offer_id) : undefined
	const { offer } = useGetOffer(offerId, { enabled: Boolean(isDealConfirm && offerId) })
	const { me } = useGetMe({ enabled: isDealConfirm || isOfferResponse })
	const ratedById =
		notification.type === 'rating_received' ? getNotificationRatedById(notification) : null
	const ratedUserId =
		notification.type === 'rating_sent' ? getNotificationRatedUserId(notification) : null
	const ratingUserId = ratedById ?? ratedUserId
	const { ratingUser } = useGetRatingUser(ratingUserId ?? undefined)
	const model = getNotificationDetailsModel(notification, t, locale, {
		offer,
		currentUserId: me?.id,
		role: me?.role,
	})

	return (
		<div className='flex flex-col gap-3'>
			<div className='flex flex-wrap items-center justify-between gap-2 border-b pb-3'>
				<div className='flex items-center gap-2'>
					<Tag className='size-4 text-brand' />
					<h2 className='text-lg font-semibold'>{notification.title}</h2>
				</div>
				<p className='text-xs text-muted-foreground'>{formatDateTimeValue(notification.created_at)}</p>
			</div>
			{model.text && <p className='text-sm leading-relaxed text-gray-800'>{model.text}</p>}
			<p className='text-sm text-muted-foreground'>{model.instruction}</p>
			{model.statusChange ? (
				<p className='text-sm text-muted-foreground'>
					{t(model.statusChange.labelKey)}{' '}
					<span className='font-semibold text-gray-900'>{model.statusChange.from}</span>
					{' => '}
					<span className='font-semibold text-gray-900'>{model.statusChange.to}</span>
				</p>
			) : null}
			{ratingUser?.id && ratingUser.display_name ? (
				<p className='text-sm text-muted-foreground'>
					{notification.type === 'rating_sent'
						? t('notifications.details.ratingTarget')
						: t('notifications.details.ratingBy')}
					: <ProfileLink id={ratingUser.id} name={ratingUser.display_name} />
				</p>
			) : null}
			{model.actions.map((action) => (
				<Button key={action.href} asChild variant='outline' size='sm' className='w-fit'>
					<Link href={action.href}>{t(action.labelKey)}</Link>
				</Button>
			))}
		</div>
	)
}
