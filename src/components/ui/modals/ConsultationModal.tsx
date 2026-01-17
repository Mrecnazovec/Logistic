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
import { useCreateConsultation } from '@/hooks/queries/support/useCreateConsultation'
import { useMemo, useState } from 'react'

type ConsultationModalProps = {
	trigger: ReactNode
}

export function ConsultationModal({ trigger }: ConsultationModalProps) {
	const { t } = useI18n()
	const [open, setOpen] = useState(false)
	const [email, setEmail] = useState('')
	const [emailError, setEmailError] = useState<string | null>(null)
	const { createConsultation, isLoading } = useCreateConsultation({
		onSuccess: () => {
			setOpen(false)
			setEmail('')
			setEmailError(null)
		},
	})
	const isSubmitDisabled = email.trim().length === 0 || isLoading
	const isEmailInvalid = useMemo(() => {
		if (email.trim().length === 0) return false
		return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
	}, [email])

	const handleSubmit = () => {
		if (isEmailInvalid) {
			setEmailError(t('consultationModal.invalidEmail'))
			return
		}
		setEmailError(null)
		createConsultation({ email: email.trim() })
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent className='max-w-[520px]'>
				<DialogHeader className='text-center'>
					<DialogTitle className='text-xl font-semibold'>{t('consultationModal.title')}</DialogTitle>
					<DialogDescription>{t('consultationModal.description')}</DialogDescription>
				</DialogHeader>
				<div className='mt-4'>
					<Input
						type='email'
						placeholder={t('consultationModal.emailPlaceholder')}
						value={email}
						aria-invalid={Boolean(emailError || isEmailInvalid)}
						onChange={(event) => {
							setEmail(event.target.value)
							setEmailError(null)
						}}
					/>
					{emailError && <p className='mt-2 text-sm text-destructive'>{emailError}</p>}
				</div>
				<DialogFooter className='mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
					<DialogClose asChild>
						<Button type='button' variant='outline' className='min-w-[140px]'>
							{t('consultationModal.close')}
						</Button>
					</DialogClose>
					<Button
						type='button'
						className='min-w-[140px]'
						disabled={isSubmitDisabled}
						onClick={handleSubmit}
					>
						{t('consultationModal.submit')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
