'use client'

import { ArrowRight, ShieldX } from 'lucide-react'
import Link from 'next/link'
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useSyncExternalStore } from 'react'
import toast from 'react-hot-toast'

import { ProfileLink } from '@/components/ui/actions/ProfileLink'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Checkbox } from '@/components/ui/Сheckbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog'
import { Loader } from '@/components/ui/Loader'
import { DASHBOARD_URL, PUBLIC_URL } from '@/config/url.config'
import { useAcceptOrderInvite } from '@/hooks/queries/orders/useAcceptOrderInvite'
import { useDeclineOrderInvite } from '@/hooks/queries/orders/useDeclineOrderInvite'
import { useConfirmOrderTerms } from '@/hooks/queries/orders/useConfirmOrderTerms'
import { useGetInvitePreview } from '@/hooks/queries/orders/useGet/useGetInvitePreview'
import { useI18n } from '@/i18n/I18nProvider'
import type { PriceCurrencyCode } from '@/lib/currency'
import { DEFAULT_PLACEHOLDER, formatDateValue, formatDistanceKm, formatPriceValue } from '@/lib/formatters'
import { getAccessToken } from '@/services/auth/auth-token.service'
import { getTransportName, type TransportTypeEnum } from '@/shared/enums/TransportType.enum'

export function InvitePageView() {
	const isHydrated = useSyncExternalStore(
		(callback) => {
			callback()
			return () => { }
		},
		() => true,
		() => false,
	)

	if (!isHydrated) {
		return <InvitePageFallback />
	}

	return <InvitePageContent />
}

function InvitePageContent() {
	const { t } = useI18n()
	const params = useParams<{ token: string }>()
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const accessToken = getAccessToken()
	const token = params?.token ?? ''
	const trimmedToken = token.trim()
	const [isTermsOpen, setIsTermsOpen] = useState(false)
	const [isTermsChecked, setIsTermsChecked] = useState(false)
	const { acceptOrderInvite, isLoadingAccept } = useAcceptOrderInvite()
	const { declineOrderInvite, isLoadingDecline } = useDeclineOrderInvite()
	const { confirmOrderTerms, isLoadingConfirmTerms } = useConfirmOrderTerms()
	const { invitePreview, isLoading: isLoadingInvitePreview } = useGetInvitePreview(accessToken ? trimmedToken : '')
	const query = searchParams.toString()
	const basePath = token ? DASHBOARD_URL.order(`invite/${token}`) : pathname
	const returnPath = query ? `${basePath}?${query}` : basePath
	const authHref = `${PUBLIC_URL.auth()}?next=${encodeURIComponent(returnPath)}`

	useEffect(() => {
		if (!accessToken) {
			router.replace(authHref)
		}
	}, [accessToken, authHref, router])

	const handleAccept = () => {
		if (!trimmedToken) {
			toast.error(t('order.invite.toast.emptyToken'))
			return
		}
		if (!isTermsChecked) {
			return
		}

		acceptOrderInvite(
			{ token: trimmedToken },
			{
				onSuccess: (order) => {
					if (order?.order_id) {
						confirmOrderTerms(order.order_id)
					}
				},
			},
		)
	}

	const handleDecline = () => {
		if (!token.trim()) {
			toast.error(t('order.invite.toast.emptyToken'))
			return
		}
		declineOrderInvite(
			{ token },
			{
				onSuccess: () => router.push(DASHBOARD_URL.home()),
			},
		)
	}

	if (!accessToken) {
		return (
			<InviteLayout>
				<InviteStateCard
					title={t('order.invite.auth.title')}
					description={t('order.invite.auth.description')}
					icon={<ShieldX className='size-10 text-brand' />}
					actions={(
						<Link href={authHref}>
							<Button>{t('order.invite.auth.action')}</Button>
						</Link>
					)}
				/>
			</InviteLayout>
		)
	}

	if (isLoadingInvitePreview) {
		return <InvitePageFallback />
	}

	if (!invitePreview) {
		return (
			<InviteLayout>
				<InviteStateCard
					title={t('order.invite.notFound.title')}
					description={t('order.invite.notFound.description')}
				/>
			</InviteLayout>
		)
	}

	const formattedLoadDate = formatDateValue(invitePreview.load_date, 'dd.MM.yyyy', DEFAULT_PLACEHOLDER)
	const formattedDeliveryDate = formatDateValue(invitePreview.delivery_date, 'dd.MM.yyyy', DEFAULT_PLACEHOLDER)
	const transport = invitePreview.transport_type
		? getTransportName(t, invitePreview.transport_type as TransportTypeEnum) || invitePreview.transport_type
		: DEFAULT_PLACEHOLDER
	const weightText = invitePreview.weight_kg
		? `${(invitePreview.weight_kg / 1000).toLocaleString('ru-RU')} ${t('order.invite.ton')}`
		: DEFAULT_PLACEHOLDER
	const formattedPrice = formatPriceValue(
		invitePreview.driver_price,
		(invitePreview.driver_currency as PriceCurrencyCode | null | undefined) ?? undefined,
	)
	const paymentMethodLabel = invitePreview.driver_payment_method
		? t(`shared.payment.${invitePreview.driver_payment_method === 'bank_transfer' ? 'bankTransfer' : invitePreview.driver_payment_method}`)
		: DEFAULT_PLACEHOLDER
	const inviter = invitePreview.inviter as { id?: number; name?: string; company?: string } | null
	const inviterName = inviter?.name ?? DEFAULT_PLACEHOLDER
	const inviterCompany = inviter?.company ?? DEFAULT_PLACEHOLDER
	const inviterNameNode =
		inviter?.id && inviter?.name ? <ProfileLink id={inviter.id} name={inviter.name} /> : inviterName

	return (
		<InviteLayout>
			<div className='w-full max-w-5xl space-y-6'>
				<Card className='rounded-3xl shadow-lg border-none'>
					<CardHeader className='pb-4'>
						<CardTitle className='text-2xl font-bold'>{t('order.invite.form.title')}</CardTitle>
						<p className='text-sm text-muted-foreground'>{t('order.invite.form.description')}</p>
					</CardHeader>
					<CardContent className='space-y-5'>
						<div className='grid gap-4 md:grid-cols-[1fr_auto_1fr] items-start'>
							<div>
								<p className='font-semibold text-foreground'>{invitePreview.origin_city ?? DEFAULT_PLACEHOLDER}</p>
								<p className='text-sm text-muted-foreground'>{formattedLoadDate}</p>
							</div>
							<div className='flex flex-col items-center justify-center text-sm font-semibold text-muted-foreground'>
								<ArrowRight className='mb-1 size-5' />
								<span>{formatDistanceKm(invitePreview.route_distance_km, DEFAULT_PLACEHOLDER)}</span>
							</div>
							<div>
								<p className='font-semibold text-foreground'>{invitePreview.destination_city ?? DEFAULT_PLACEHOLDER}</p>
								<p className='text-sm text-muted-foreground'>{formattedDeliveryDate}</p>
							</div>
						</div>
						<div className='grid gap-4 md:grid-cols-3 text-sm text-muted-foreground'>
							<p>
								<span className='font-semibold text-foreground'>{t('order.invite.transportType')}: </span>
								{transport}
							</p>
							<p>
								<span className='font-semibold text-foreground'>{t('order.invite.weight')}: </span>
								{weightText}
							</p>
							<p>
								<span className='font-semibold text-foreground'>{t('order.field.price')}: </span>
								{formattedPrice}
							</p>
						</div>
						<div className='flex flex-wrap items-center gap-3 text-sm text-muted-foreground'>
							<span className='font-semibold text-foreground'>{t('order.invite.company')}:</span> {inviterCompany}
						</div>
						<div className='flex flex-wrap items-center gap-3 text-sm text-muted-foreground'>
							<span className='font-semibold text-foreground'>{t('order.invite.representative')}:</span> {inviterNameNode}
						</div>
					</CardContent>
				</Card>

				<Card className='rounded-3xl shadow-lg border-none'>
					<CardHeader className='pb-4'>
						<CardTitle className='text-xl font-semibold'>{t('order.invite.response.title')}</CardTitle>
						<p className='text-sm text-muted-foreground'>{t('order.invite.response.description')}</p>
					</CardHeader>
					<CardContent className='space-y-4'>
						<div className='flex flex-wrap items-center gap-3 text-sm text-muted-foreground'>
							<span className='font-semibold text-foreground'>{t('order.invite.paymentMethod')}:</span>
							{paymentMethodLabel}
						</div>
						<div className='flex items-start gap-3 text-sm text-muted-foreground'>
							<Checkbox
								id='invite-terms'
								className='shrink-0'
								checked={isTermsChecked}
								onCheckedChange={(value) => setIsTermsChecked(Boolean(value))}
								disabled={isLoadingAccept || isLoadingConfirmTerms || isLoadingDecline}
							/>
							<label htmlFor='invite-terms' className='min-w-0 cursor-pointer leading-snug'>
								{t('order.agreement.terms.text')}{' '}
								<Dialog open={isTermsOpen} onOpenChange={setIsTermsOpen}>
									<DialogTrigger asChild>
										<button type='button' className='text-brand underline-offset-4 hover:underline'>
											{t('order.agreement.terms.link')}
										</button>
									</DialogTrigger>
									<DialogContent className='max-w-3xl'>
										<DialogHeader>
											<DialogTitle className='text-center text-2xl font-semibold'>
												{t('order.agreement.terms.title')}
											</DialogTitle>
										</DialogHeader>
										<div className='space-y-4 text-sm leading-relaxed text-foreground'>
											<p>{t('order.agreement.terms.intro')}</p>
											<p>{t('order.agreement.terms.delay')}</p>
											<div className='space-y-2'>
												<p className='font-semibold'>{t('order.agreement.terms.responsibility.title')}</p>
												<div className='space-y-2'>
													<p>{t('order.agreement.terms.responsibility.logistic.title')}</p>
													<ul className='list-disc space-y-1 pl-5'>
														<li>{t('order.agreement.terms.responsibility.logistic.item1')}</li>
														<li>{t('order.agreement.terms.responsibility.logistic.item2')}</li>
													</ul>
												</div>
												<div className='space-y-2'>
													<p>{t('order.agreement.terms.responsibility.driver.title')}</p>
													<ul className='list-disc space-y-1 pl-5'>
														<li>{t('order.agreement.terms.responsibility.driver.item1')}</li>
														<li>{t('order.agreement.terms.responsibility.driver.item2')}</li>
														<li>{t('order.agreement.terms.responsibility.driver.item3')}</li>
													</ul>
												</div>
											</div>
											<div className='space-y-2'>
												<p className='font-semibold'>{t('order.agreement.terms.conflicts.title')}</p>
												<p>{t('order.agreement.terms.conflicts.text')}</p>
											</div>
											<div className='space-y-2'>
												<p className='font-semibold'>{t('order.agreement.terms.cancel.title')}</p>
												<ol className='list-decimal space-y-1 pl-5'>
													<li>{t('order.agreement.terms.cancel.item1')}</li>
													<li>{t('order.agreement.terms.cancel.item2')}</li>
												</ol>
											</div>
											<div className='space-y-2'>
												<p className='font-semibold'>{t('order.agreement.terms.force.title')}</p>
												<p>{t('order.agreement.terms.force.text')}</p>
											</div>
											<div className='space-y-2'>
												<p className='font-semibold'>{t('order.agreement.terms.final.title')}</p>
												<p>{t('order.agreement.terms.final.text')}</p>
											</div>
										</div>
									</DialogContent>
								</Dialog>
							</label>
						</div>
						<div className='flex flex-wrap justify-end gap-3'>
							<Button
								onClick={handleDecline}
								disabled={isLoadingAccept || isLoadingConfirmTerms || isLoadingDecline}
								variant='destructive'
								className='rounded-full'
							>
								{isLoadingDecline ? t('order.invite.form.declineLoading') : t('order.invite.form.decline')}
							</Button>
							<Button
								onClick={handleAccept}
								disabled={isLoadingAccept || isLoadingConfirmTerms || isLoadingDecline || !isTermsChecked}
								className={
									isTermsChecked
										? 'rounded-full bg-success-500 text-white hover:bg-success-600'
										: 'rounded-full bg-[#9CA3AF] text-white hover:bg-[#6B7280]'
								}
							>
								{isLoadingAccept || isLoadingConfirmTerms
									? t('order.invite.form.acceptLoading')
									: t('order.invite.form.accept')}
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</InviteLayout>
	)
}

function InvitePageFallback() {
	const { t } = useI18n()

	return (
		<InviteLayout>
			<div className='flex flex-col items-center gap-3 text-muted-foreground'>
				<Loader />
				<p>{t('order.invite.loading')}</p>
			</div>
		</InviteLayout>
	)
}

function InviteLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className='h-full bg-background rounded-4xl flex items-center justify-center'>
			{children}
		</div>
	)
}

function InviteStateCard({
	title,
	description,
	icon,
	actions,
}: {
	title: string
	description: string
	icon?: React.ReactNode
	actions?: React.ReactNode
}) {
	return (
		<Card className='w-full max-w-xl text-center rounded-3xl shadow-lg border-none'>
			<CardContent className='py-10 flex flex-col items-center gap-4'>
				{icon}
				<div className='space-y-1'>
					<p className='text-xl font-semibold text-foreground'>{title}</p>
					<p className='text-sm text-muted-foreground'>{description}</p>
				</div>
				{actions}
			</CardContent>
		</Card>
	)
}
