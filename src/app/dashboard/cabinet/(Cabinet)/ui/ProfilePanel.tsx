import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/form-control/Input'
import { Label } from '@/components/ui/form-control/Label'
import { NoPhoto } from '@/components/ui/NoPhoto'
import { Skeleton } from '@/components/ui/Skeleton'
import { DASHBOARD_URL } from '@/config/url.config'
import { LogOut, Pencil } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { ProfileField } from '../types/cabinet'

type TranslateFn = (...args: any[]) => string

type ProfilePanelProps = {
	t: TranslateFn
	me?: {
		id?: number
		photo?: string | null
		company_name?: string | null
		first_name?: string | null
		email?: string | null
		phone?: string | null
		profile?: { city?: string | null; country?: string | null } | null
	}
	isLoading: boolean
	isLoadingLogout: boolean
	logout: (redirectTo: string) => void
	profileFields: ProfileField[]
	emailValue: string
	phoneValue: string
	isEmailMissing: boolean
	isEmailVerified: boolean
	shouldShowEmailActions: boolean
	isResendingVerify: boolean
	isPhoneMissing: boolean
	isSendingPhoneOtp: boolean
	isVerifyingPhoneOtp: boolean
	isLoadingUpdateMe: boolean
	onOpenEmailModal: () => void
	onOpenPhoneModal: () => void
}

export function ProfilePanel({
	t,
	me,
	isLoading,
	isLoadingLogout,
	logout,
	profileFields,
	emailValue,
	phoneValue,
	isEmailMissing,
	isEmailVerified,
	shouldShowEmailActions,
	isResendingVerify,
	isPhoneMissing,
	isSendingPhoneOtp,
	isVerifyingPhoneOtp,
	isLoadingUpdateMe,
	onOpenEmailModal,
	onOpenPhoneModal,
}: ProfilePanelProps) {
	return (
		<div className='lg:w-[32%] xl:w-[30%]'>
			<Card className='h-full items-center rounded-[32px] border-none bg-background px-6 py-8 gap-0'>
				<div className='centred w-full flex-col gap-3 text-center relative'>
					{isLoading ? (
						<>
							<Skeleton className='size-24 rounded-full' />
							<Skeleton className='h-4 w-32 rounded-full' />
							<Skeleton className='h-6 w-40 rounded-full' />
						</>
					) : (
						<>
							{me?.photo ? (
								<Image src={me.photo} alt={t('cabinet.photoAlt')} width={96} height={96} className='size-24 rounded-full object-cover' />
							) : (
								<NoPhoto className='size-24' />
							)}
							<p className='text-base font-semibold text-foreground'>{me?.company_name || me?.first_name || me?.email}</p>

							<p className='text-xs text-muted-foreground'>
								{me?.first_name && me?.email ? me.email : me?.profile?.city || me?.profile?.country || ''}
							</p>
							<div className='flex items-center justify-center gap-2 text-xs text-muted-foreground'>
								<span className='text-xs text-muted-foreground'>{t('cabinet.profile.id')}:</span>
								<UuidCopy id={me?.id} isPlaceholder />
							</div>
							<Button
								onClick={() => logout('')}
								size='icon'
								className='bg-error-500 hover:bg-error-400 absolute right-0 top-0 rounded-2xl'
								disabled={isLoadingLogout}
							>
								<LogOut />
							</Button>
						</>
					)}
				</div>

				<div className='mt-10 w-full space-y-4'>
					<Link className='flex justify-end' href={DASHBOARD_URL.settings()}>
						<Button variant='link' size='sm' className='h-auto px-0 text-xs text-brand'>
							<Pencil className='size-3.5' />
							{t('cabinet.edit')}
						</Button>
					</Link>

					{profileFields.length ? (
						<div className='space-y-2'>
							<Label className='text-xs text-muted-foreground' htmlFor={profileFields[0].id}>
								{profileFields[0].label}
							</Label>
							{isLoading ? (
								<Skeleton className='h-11 w-full rounded-3xl' />
							) : (
								<Input
									disabled
									value={profileFields[0].value}
									id={profileFields[0].id}
									className='disabled:opacity-100'
									placeholder={profileFields[0].label}
								/>
							)}
						</div>
					) : null}

					<div className='space-y-2'>
						<div className='flex items-center justify-between gap-2'>
							<Label className='text-xs text-muted-foreground' htmlFor='email'>
								{t('cabinet.profile.email')}
							</Label>
							{!isEmailMissing ? (
								<Button type='button' variant='link' size='sm' className='h-auto px-0 text-xs text-brand' onClick={onOpenEmailModal}>
									{t('cabinet.profile.emailEdit')}
								</Button>
							) : null}
						</div>
						{isLoading ? (
							<Skeleton className='h-11 w-full rounded-3xl' />
						) : (
							<Input
								id='email'
								value={emailValue}
								disabled
								className='rounded-3xl bg-grayscale-50 text-[15px] placeholder:text-muted-foreground/80 disabled:opacity-100'
								placeholder={t('cabinet.profile.emailPlaceholder')}
							/>
						)}
						{!isEmailVerified ? <p className='text-xs text-error-500'>{t('cabinet.profile.emailNeedsVerify')}</p> : null}
						{shouldShowEmailActions ? (
							<div className='pt-2'>
								<Button type='button' variant='outline' disabled={isResendingVerify} onClick={onOpenEmailModal}>
									{t('cabinet.profile.emailSendCode')}
								</Button>
							</div>
						) : null}
					</div>

					<div className='space-y-2'>
						<div className='flex items-center justify-between gap-2'>
							<Label className='text-xs text-muted-foreground' htmlFor='phone'>
								{t('cabinet.profile.phone')}
							</Label>
							{!isPhoneMissing ? (
								<Button type='button' variant='link' size='sm' className='h-auto px-0 text-xs text-brand' onClick={onOpenPhoneModal}>
									{t('cabinet.profile.phoneEdit')}
								</Button>
							) : null}
						</div>
						{isLoading ? (
							<Skeleton className='h-11 w-full rounded-3xl' />
						) : (
							<Input
								id='phone'
								value={phoneValue}
								disabled
								className='rounded-3xl bg-grayscale-50 text-[15px] placeholder:text-muted-foreground/80 disabled:opacity-100'
								placeholder={t('cabinet.profile.phonePlaceholder')}
							/>
						)}
						{isPhoneMissing ? (
							<div className='pt-2'>
								<Button
									type='button'
									variant='outline'
									disabled={isSendingPhoneOtp || isVerifyingPhoneOtp || isLoadingUpdateMe}
									onClick={onOpenPhoneModal}
								>
									{t('cabinet.profile.phoneSendCode')}
								</Button>
							</div>
						) : null}
					</div>

					{profileFields.slice(1).map((field) => (
						<div key={field.id} className='space-y-2'>
							<Label className='text-xs text-muted-foreground' htmlFor={field.id}>
								{field.label}
							</Label>
							{isLoading ? (
								<Skeleton className='h-11 w-full rounded-3xl' />
							) : (
								<Input disabled value={field.value} id={field.id} className='disabled:opacity-100' placeholder={field.label} />
							)}
						</div>
					))}
				</div>
			</Card>
		</div>
	)
}
