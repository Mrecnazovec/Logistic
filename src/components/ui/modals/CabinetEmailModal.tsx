'use client'

import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/form-control/Input'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/InputOTP'
import { useI18n } from '@/i18n/I18nProvider'
import { useMemo, useState } from 'react'

type CabinetEmailModalProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	email: string
	isEmailVerified: boolean
	isSending: boolean
	isVerifying: boolean
	onSendCode: (email: string) => void
	onVerifyCode: (code: string) => void
}

export function CabinetEmailModal({
	open,
	onOpenChange,
	email,
	isEmailVerified,
	isSending,
	isVerifying,
	onSendCode,
	onVerifyCode,
}: CabinetEmailModalProps) {
	const { t } = useI18n()
	const [emailDraft, setEmailDraft] = useState(email)
	const [emailCode, setEmailCode] = useState('')
	const [step, setStep] = useState<1 | 2>(1)
	const isEmailMissing = emailDraft.trim().length === 0
	const isEmailInvalid = useMemo(() => {
		if (!emailDraft.trim()) return false
		return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailDraft.trim())
	}, [emailDraft])

	const handleOpenChange = (nextOpen: boolean) => {
		onOpenChange(nextOpen)
		setEmailDraft(email)
		setEmailCode('')
		setStep(1)
	}

	const handleSendCode = () => {
		if (isEmailMissing || isEmailInvalid) return
		onSendCode(emailDraft.trim())
		setStep(2)
	}

	const handleVerify = () => {
		if (!emailDraft.trim() || emailCode.trim().length < 6) return
		onVerifyCode(emailCode.trim())
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className='max-w-[520px]'>
				<DialogHeader>
					<DialogTitle>{t('cabinet.profile.email')}</DialogTitle>
				</DialogHeader>
				{step === 1 ? (
					<div className='space-y-4'>
						<p className='text-sm text-muted-foreground'>{t('cabinet.profile.emailStepIntro')}</p>
						<div className='space-y-2'>
							<Input
								value={emailDraft}
								onChange={(event) => setEmailDraft(event.target.value)}
								className='rounded-3xl bg-grayscale-50 text-[15px] placeholder:text-muted-foreground/80'
								placeholder={t('cabinet.profile.emailPlaceholder')}
								aria-invalid={isEmailInvalid}
							/>
							{!isEmailVerified ? <p className='text-xs text-warning-600'>{t('cabinet.profile.emailNeedsVerify')}</p> : null}
							{isEmailInvalid ? <p className='text-xs text-destructive'>{t('cabinet.profile.emailRequired')}</p> : null}
						</div>
						<div className='flex justify-end flex-wrap gap-2'>
							<Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
								{t('cabinet.profile.emailCancel')}
							</Button>
							<Button type='button' disabled={isSending || isEmailMissing || isEmailInvalid} onClick={handleSendCode}>
								{t('cabinet.profile.emailSend')}
							</Button>
						</div>
					</div>
				) : (
					<div className='space-y-6'>
						<p className='text-sm text-muted-foreground'>{t('cabinet.profile.emailOtpIntro')}</p>
						<div className='flex justify-center'>
							<InputOTP maxLength={6} value={emailCode} onChange={setEmailCode}>
								<InputOTPGroup>
									{Array.from({ length: 6 }).map((_, index) => (
										<InputOTPSlot key={`email-otp-${index}`} index={index} />
									))}
								</InputOTPGroup>
							</InputOTP>
						</div>
						<div className='flex flex-wrap justify-end gap-2'>
							<Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
								{t('cabinet.profile.emailCancel')}
							</Button>
							<Button type='button' disabled={isVerifying || emailCode.trim().length < 6} onClick={handleVerify}>
								{t('common.confirm')}
							</Button>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	)
}
