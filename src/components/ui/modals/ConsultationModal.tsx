'use client'

import type { ReactNode } from 'react'

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
import { Input } from '@/components/ui/form-control/Input'
import { useI18n } from '@/i18n/I18nProvider'

type ConsultationModalProps = {
	trigger: ReactNode
}

export function ConsultationModal({ trigger }: ConsultationModalProps) {
	const { t } = useI18n()

	return (
		<Dialog>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent className='max-w-[520px]'>
				<DialogHeader className='text-center'>
					<DialogTitle className='text-xl font-semibold'>{t('consultationModal.title')}</DialogTitle>
					<DialogDescription>{t('consultationModal.description')}</DialogDescription>
				</DialogHeader>
				<div className='mt-4'>
					<Input type='email' placeholder={t('consultationModal.emailPlaceholder')} />
				</div>
				<DialogFooter className='mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
					<DialogClose asChild>
						<Button type='button' variant='outline' className='min-w-[140px]'>
							{t('consultationModal.close')}
						</Button>
					</DialogClose>
					<Button type='button' className='min-w-[140px]'>
						{t('consultationModal.submit')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
