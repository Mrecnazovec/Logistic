import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/Dialog'
import { DASHBOARD_URL } from '@/config/url.config'
import type { PaymentPageTranslator } from '../types/paymentPage.types'

type PaymentDisputeDialogProps = {
	open: boolean
	onOpenChange: (value: boolean) => void
	t: PaymentPageTranslator
}

export function PaymentDisputeDialog({ open, onOpenChange, t }: PaymentDisputeDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>
				<Button className='min-w-[120px] bg-error-500 text-white hover:bg-error-600'>
					{t('order.payment.actions.dispute')}
				</Button>
			</DialogTrigger>
			<DialogContent className='w-[520px] max-w-[calc(100vw-2rem)] rounded-3xl'>
				<DialogHeader className='items-center text-center'>
					<DialogTitle className='text-xl font-semibold'>{t('order.payment.dispute.title')}</DialogTitle>
					<DialogDescription className='text-sm text-muted-foreground'>
						{t('order.payment.dispute.description')}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className='flex w-full flex-row justify-center gap-3 sm:justify-center'>
					<DialogClose asChild>
						<Button variant='secondary' className='min-w-[160px]'>
							{t('order.payment.dispute.close')}
						</Button>
					</DialogClose>
					<Link href={DASHBOARD_URL.settings('support')}>
						<Button className='min-w-[160px]'>{t('order.payment.dispute.support')}</Button>
					</Link>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
