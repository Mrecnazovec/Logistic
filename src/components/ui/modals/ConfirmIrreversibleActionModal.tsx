'use client'

import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/Dialog'
import { useI18n } from '@/i18n/I18nProvider'

type ConfirmIrreversibleActionModalProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	onConfirm: () => void
	isConfirmLoading?: boolean
}

export function ConfirmIrreversibleActionModal({
	open,
	onOpenChange,
	onConfirm,
	isConfirmLoading = false,
}: ConfirmIrreversibleActionModalProps) {
	const { t } = useI18n()

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogTitle>{t('components.cargoActions.deleteConfirmTitle')}</DialogTitle>
				<DialogDescription>{t('components.cargoActions.deleteConfirmDescription')}</DialogDescription>
				<DialogFooter>
					<Button variant='outline' onClick={() => onOpenChange(false)} disabled={isConfirmLoading}>
						{t('components.cargoActions.deleteConfirmCancel')}
					</Button>
					<Button className='bg-error-500 hover:bg-error-400' onClick={onConfirm} disabled={isConfirmLoading}>
						{t('components.cargoActions.deleteConfirmConfirm')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
