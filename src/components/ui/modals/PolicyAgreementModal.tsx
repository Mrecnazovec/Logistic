'use client'

import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Сheckbox'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { useI18n } from '@/i18n/I18nProvider'

type PolicyAgreementModalProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	accepted: boolean
	onAcceptedChange: (accepted: boolean) => void
	onSubmit: () => void
	isSubmitting: boolean
}

export function PolicyAgreementModal({
	open,
	onOpenChange,
	accepted,
	onAcceptedChange,
	onSubmit,
	isSubmitting,
}: PolicyAgreementModalProps) {
	const { t } = useI18n()

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='max-w-[640px]'>
				<DialogHeader>
					<DialogTitle>{t('policy.modal.title')}</DialogTitle>
					<DialogDescription>{t('policy.modal.subtitle')}</DialogDescription>
				</DialogHeader>
				<div className='max-h-[45vh] overflow-y-auto rounded-2xl bg-accent p-4 text-sm text-foreground'>
					<p>{t('policy.modal.content')}</p>
				</div>
				<div className='flex items-center gap-3'>
					<Checkbox
						id='policy-accept'
						checked={accepted}
						onCheckedChange={(value) => onAcceptedChange(Boolean(value))}
					/>
					<label htmlFor='policy-accept' className='text-sm text-foreground cursor-pointer'>
						{t('policy.modal.accept')}
					</label>
				</div>
				<DialogFooter className='sm:justify-end'>
					<Button type='button' disabled={!accepted || isSubmitting} onClick={onSubmit}>
						{t('policy.modal.submit')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
