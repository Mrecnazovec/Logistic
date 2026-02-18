'use client'

import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/Dialog'
import { useI18n } from '@/i18n/I18nProvider'

type ConfirmIrreversibleActionModalProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	onConfirm: () => void
	isConfirmLoading?: boolean
	titleKey?: string
	descriptionKey?: string
	cancelKey?: string
	confirmKey?: string
}

export function ConfirmIrreversibleActionModal({
	open,
	onOpenChange,
	onConfirm,
	isConfirmLoading = false,
	titleKey = 'components.cargoActions.deleteConfirmTitle',
	descriptionKey = 'components.cargoActions.deleteConfirmDescription',
	cancelKey = 'components.cargoActions.deleteConfirmCancel',
	confirmKey = 'components.cargoActions.deleteConfirmConfirm',
}: ConfirmIrreversibleActionModalProps) {
	const { t } = useI18n()

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogTitle>{t(titleKey)}</DialogTitle>
				<DialogDescription>{t(descriptionKey)}</DialogDescription>
				<DialogFooter>
					<Button type='button' variant='outline' onClick={() => onOpenChange(false)} disabled={isConfirmLoading}>
						{t(cancelKey)}
					</Button>
					<Button type='button' className='bg-error-500 hover:bg-error-400' onClick={onConfirm} disabled={isConfirmLoading}>
						{t(confirmKey)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
