'use client'

import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/form-control/Input'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/InputOTP'
import { useI18n } from '@/i18n/I18nProvider'
import { useState } from 'react'

type CabinetPhoneModalProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	phone: string
	isSending: boolean
	isVerifying: boolean
	onSendCode: (phone: string) => void
	onVerifyCode: (payload: { phone: string; code: string }) => void
}

export function CabinetPhoneModal({
	open,
	onOpenChange,
	phone,
	isSending,
	isVerifying,
	onSendCode,
	onVerifyCode,
}: CabinetPhoneModalProps) {
	const { t } = useI18n()
	const [phoneDraft, setPhoneDraft] = useState(phone)
	const [phoneCode, setPhoneCode] = useState('')
	const [step, setStep] = useState<1 | 2>(1)
	const isPhoneMissing = phoneDraft.trim().length === 0

	const handleOpenChange = (nextOpen: boolean) => {
		onOpenChange(nextOpen)
		setPhoneDraft(phone)
		setPhoneCode('')
		setStep(1)
	}

	const handleSendCode = () => {
		if (isPhoneMissing) return
		onSendCode(phoneDraft.trim())
		setStep(2)
	}

	const handleVerify = () => {
		const nextPhone = phoneDraft.trim()
		const nextCode = phoneCode.trim()
		if (!nextPhone || nextCode.length < 6) return
		onVerifyCode({ phone: nextPhone, code: nextCode })
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className='max-w-[520px]'>
				<DialogHeader>
					<DialogTitle>{t('cabinet.profile.phone')}</DialogTitle>
				</DialogHeader>
				{step === 1 ? (
					<div className='space-y-4'>
						<p className='text-sm text-muted-foreground'>{t('cabinet.profile.phoneStepIntro')}</p>
						<div className='space-y-2'>
							<Input
								value={phoneDraft}
								onChange={(event) => setPhoneDraft(event.target.value)}
								className='rounded-3xl bg-grayscale-50 text-[15px] placeholder:text-muted-foreground/80'
								placeholder={t('cabinet.profile.phonePlaceholder')}
							/>
							{isPhoneMissing ? <p className='text-xs text-destructive'>{t('cabinet.profile.phoneRequired')}</p> : null}
						</div>
						<div className='flex justify-end flex-wrap gap-2'>
							<Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
								{t('cabinet.profile.phoneCancel')}
							</Button>
							<Button type='button' disabled={isSending || isPhoneMissing} onClick={handleSendCode}>
								{t('cabinet.profile.phoneSend')}
							</Button>
						</div>
					</div>
				) : (
					<div className='space-y-6'>
						<p className='text-sm text-muted-foreground'>{t('cabinet.profile.phoneOtpIntro')}</p>
						<div className='flex justify-center'>
							<InputOTP maxLength={6} value={phoneCode} onChange={setPhoneCode}>
								<InputOTPGroup>
									{Array.from({ length: 6 }).map((_, index) => (
										<InputOTPSlot key={`phone-otp-${index}`} index={index} />
									))}
								</InputOTPGroup>
							</InputOTP>
						</div>
						<div className='flex flex-wrap justify-end gap-2'>
							<Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
								{t('cabinet.profile.phoneCancel')}
							</Button>
							<Button type='button' disabled={isVerifying || phoneCode.trim().length < 6} onClick={handleVerify}>
								{t('common.confirm')}
							</Button>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	)
}
