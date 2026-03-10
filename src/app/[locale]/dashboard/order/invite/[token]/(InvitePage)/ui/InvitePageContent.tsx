import { ShieldX } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { useInvitePage } from '../hooks/useInvitePage'
import { InviteLayout } from './InviteLayout'
import { InvitePageFallback } from './InvitePageFallback'
import { InviteResponseCard } from './InviteResponseCard'
import { InviteStateCard } from './InviteStateCard'
import { InviteSummaryCard } from './InviteSummaryCard'

export function InvitePageContent() {
	const {
		t,
		accessToken,
		authHref,
		invitePreview,
		previewViewModel,
		isLoadingInvitePreview,
		isTermsOpen,
		setIsTermsOpen,
		isTermsChecked,
		setIsTermsChecked,
		isSubmitting,
		isLoadingDecline,
		isLoadingAccept,
		isLoadingConfirmTerms,
		handleAccept,
		handleDecline,
	} = useInvitePage()

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

	if (isLoadingInvitePreview) {
		return <InvitePageFallback t={t} />
	}

	if (!invitePreview || !previewViewModel) {
		return (
			<InviteLayout>
				<InviteStateCard
					title={t('order.invite.notFound.title')}
					description={t('order.invite.notFound.description')}
				/>
			</InviteLayout>
		)
	}

	return (
		<InviteLayout>
			<div className='w-full max-w-5xl space-y-6'>
				<InviteSummaryCard model={previewViewModel} t={t} />
				<InviteResponseCard
					paymentMethodLabel={previewViewModel.paymentMethodLabel}
					isTermsChecked={isTermsChecked}
					isTermsOpen={isTermsOpen}
					isSubmitting={isSubmitting}
					isLoadingDecline={isLoadingDecline}
					isLoadingAccept={isLoadingAccept}
					isLoadingConfirmTerms={isLoadingConfirmTerms}
					onTermsCheckedChange={setIsTermsChecked}
					onTermsOpenChange={setIsTermsOpen}
					onDecline={handleDecline}
					onAccept={handleAccept}
					t={t}
				/>
			</div>
		</InviteLayout>
	)
}
