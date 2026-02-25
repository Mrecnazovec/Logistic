import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import type { InvitePageTranslator } from '../types/invitePage.types'
import { InviteTermsSection } from './InviteTermsSection'

type InviteResponseCardProps = {
	paymentMethodLabel: string
	isTermsChecked: boolean
	isTermsOpen: boolean
	isSubmitting: boolean
	isLoadingDecline: boolean
	isLoadingAccept: boolean
	isLoadingConfirmTerms: boolean
	onTermsCheckedChange: (value: boolean) => void
	onTermsOpenChange: (value: boolean) => void
	onDecline: () => void
	onAccept: () => void
	t: InvitePageTranslator
}

export function InviteResponseCard({
	paymentMethodLabel,
	isTermsChecked,
	isTermsOpen,
	isSubmitting,
	isLoadingDecline,
	isLoadingAccept,
	isLoadingConfirmTerms,
	onTermsCheckedChange,
	onTermsOpenChange,
	onDecline,
	onAccept,
	t,
}: InviteResponseCardProps) {
	return (
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

				<InviteTermsSection
					isTermsChecked={isTermsChecked}
					isTermsOpen={isTermsOpen}
					isDisabled={isSubmitting}
					onTermsCheckedChange={onTermsCheckedChange}
					onTermsOpenChange={onTermsOpenChange}
					t={t}
				/>

				<div className='flex flex-wrap justify-end gap-3'>
					<Button onClick={onDecline} disabled={isSubmitting} variant='destructive' className='rounded-full'>
						{isLoadingDecline ? t('order.invite.form.declineLoading') : t('order.invite.form.decline')}
					</Button>
					<Button
						onClick={onAccept}
						disabled={isSubmitting || !isTermsChecked}
						className={
							isTermsChecked
								? 'rounded-full bg-success-500 text-white hover:bg-success-600'
								: 'rounded-full bg-[#9CA3AF] text-white hover:bg-[#6B7280]'
						}
					>
						{isLoadingAccept || isLoadingConfirmTerms ? t('order.invite.form.acceptLoading') : t('order.invite.form.accept')}
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}
