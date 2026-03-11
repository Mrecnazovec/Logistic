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
import type { PaymentConfirmAction, PaymentPageTranslator } from '../types/paymentPage.types'

type PaymentConfirmDialogProps = {
	open: boolean
	onOpenChange: (value: boolean) => void
	isPaymentAvailable: boolean
	confirmAction: PaymentConfirmAction
	t: PaymentPageTranslator
}

export function PaymentConfirmDialog({
	open,
	onOpenChange,
	isPaymentAvailable,
	confirmAction,
	t,
}: PaymentConfirmDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>
				<Button
					className='min-w-[140px] bg-success-500 text-white hover:bg-success-600'
					disabled={!isPaymentAvailable || confirmAction.isLoading || confirmAction.isConfirmed}
				>
					{t('order.payment.actions.finish')}
				</Button>
			</DialogTrigger>
			<DialogContent className='w-[520px] max-w-[calc(100vw-2rem)] rounded-3xl'>
				<DialogHeader className='items-center text-center'>
					<DialogTitle className='text-xl font-semibold'>{t('order.payment.confirm.title')}</DialogTitle>
					<DialogDescription className='text-sm text-muted-foreground'>
						{t('order.payment.confirm.description')}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className='flex w-full flex-row justify-center gap-3 sm:justify-center'>
					<DialogClose asChild>
						<Button variant='secondary' className='min-w-[160px]'>
							{t('order.payment.confirm.cancel')}
						</Button>
					</DialogClose>
					<Button
						className='min-w-[160px]'
						disabled={confirmAction.isLoading || confirmAction.isConfirmed}
						onClick={() => {
							confirmAction.onConfirm()
							onOpenChange(false)
						}}
					>
						{t('order.payment.confirm.action')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
