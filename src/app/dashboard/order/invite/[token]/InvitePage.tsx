'use client'

import { ShieldX } from 'lucide-react'
import Link from 'next/link'
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Checkbox } from '@/components/ui/Сheckbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/form-control/Input'
import { Loader } from '@/components/ui/Loader'
import { DASHBOARD_URL, PUBLIC_URL } from '@/config/url.config'
import { useAcceptOrderInvite } from '@/hooks/queries/orders/useAcceptOrderInvite'
import { useConfirmOrderTerms } from '@/hooks/queries/orders/useConfirmOrderTerms'
import { useI18n } from '@/i18n/I18nProvider'
import { getAccessToken } from '@/services/auth/auth-token.service'

export function InvitePage() {
	const isHydrated = useSyncExternalStore(
		(callback) => {
			callback()
			return () => {}
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
	const initialToken = params?.token ?? ''
	const [token, setToken] = useState(initialToken)
	const [isTermsOpen, setIsTermsOpen] = useState(false)
	const [isTermsChecked, setIsTermsChecked] = useState(false)
	const { acceptOrderInvite, isLoadingAccept } = useAcceptOrderInvite()
	const { confirmOrderTerms, isLoadingConfirmTerms } = useConfirmOrderTerms()
	const returnPath = useMemo(() => {
		const query = searchParams.toString()
		return query ? `${pathname}?${query}` : pathname
	}, [pathname, searchParams])
	const authHref = useMemo(() => `${PUBLIC_URL.auth()}?next=${encodeURIComponent(returnPath)}`, [returnPath])

	useEffect(() => {
		if (!accessToken) {
			router.replace(authHref)
		}
	}, [accessToken, authHref, router])

	const handleAccept = () => {
		const trimmed = token.trim()
		if (!trimmed) {
			toast.error(t('order.invite.toast.emptyToken'))
			return
		}
		if (!isTermsChecked) {
			return
		}

		acceptOrderInvite(
			{ token: trimmed },
			{
				onSuccess: (order) => {
					if (order?.order_id) {
						confirmOrderTerms(order.order_id)
					}
				},
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
					actions={
						<Link href={authHref}>
							<Button>{t('order.invite.auth.action')}</Button>
						</Link>
					}
				/>
			</InviteLayout>
		)
	}

	return (
		<InviteLayout>
			<Card className='w-full max-w-xl rounded-3xl border-none shadow-lg'>
				<CardHeader className='pb-4'>
					<CardTitle className='text-2xl font-bold'>{t('order.invite.form.title')}</CardTitle>
					<p className='text-sm text-muted-foreground'>{t('order.invite.form.description')}</p>
				</CardHeader>
				<CardContent className='space-y-4'>
					<Input
						value={token}
						onChange={(event) => setToken(event.target.value)}
						placeholder={t('order.invite.form.placeholder')}
						disabled={isLoadingAccept || isLoadingConfirmTerms}
					/>
					<div className='flex items-start gap-3 text-sm text-muted-foreground'>
						<Checkbox
							id='invite-terms'
							className='shrink-0'
							checked={isTermsChecked}
							onCheckedChange={(value) => setIsTermsChecked(Boolean(value))}
							disabled={isLoadingAccept || isLoadingConfirmTerms}
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
										<DialogTitle className='text-center text-2xl font-semibold'>{t('order.agreement.terms.title')}</DialogTitle>
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
					<div className='flex justify-end gap-3'>
						<Button
							variant='outline'
							onClick={() => setToken(initialToken)}
							disabled={isLoadingAccept || isLoadingConfirmTerms}
						>
							{t('order.invite.form.reset')}
						</Button>
						<Button
							onClick={handleAccept}
							disabled={isLoadingAccept || isLoadingConfirmTerms || !isTermsChecked}
							className={
								isTermsChecked
									? 'bg-brand text-white'
									: 'bg-[#9CA3AF] text-white hover:bg-[#6B7280]'
							}
						>
							{isLoadingAccept || isLoadingConfirmTerms
								? t('order.invite.form.acceptLoading')
								: t('order.invite.form.accept')}
						</Button>
					</div>
				</CardContent>
			</Card>
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
