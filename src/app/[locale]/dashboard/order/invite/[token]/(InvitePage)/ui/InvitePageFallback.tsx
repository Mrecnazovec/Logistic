import { Loader } from '@/components/ui/Loader'
import type { InvitePageTranslator } from '../types/invitePage.types'
import { InviteLayout } from './InviteLayout'

export function InvitePageFallback({ t }: { t: InvitePageTranslator }) {
	return (
		<InviteLayout>
			<div className='flex flex-col items-center gap-3 text-muted-foreground'>
				<Loader />
				<p>{t('order.invite.loading')}</p>
			</div>
		</InviteLayout>
	)
}
