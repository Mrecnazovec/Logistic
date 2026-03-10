import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { formatCountdown } from '../lib/agreementPage.utils'

type AgreementHeaderProps = {
	agreementId: number
	statusLabel: string
	statusClassName: string
	progress: number
	displayedRemainingMs: number
	tAgreementNumber: string
}

export function AgreementHeader({
	agreementId,
	statusLabel,
	statusClassName,
	progress,
	displayedRemainingMs,
	tAgreementNumber,
}: AgreementHeaderProps) {
	return (
		<div className='flex flex-wrap items-center justify-between gap-6'>
			<div className='text-sm text-muted-foreground'>
				<div className='flex items-center gap-4'>
					{tAgreementNumber} <UuidCopy id={agreementId} isPlaceholder />
				</div>
				<span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClassName}`}>{statusLabel}</span>
			</div>
			<div className='relative flex items-center justify-center'>
				<div
					className='flex xs:size-20 size-10 items-center justify-center rounded-full p-[6px]'
					style={{ background: `conic-gradient(#2563eb ${progress * 360}deg, #e5e7eb 0deg)` }}
				>
					<div className='flex size-full items-center justify-center rounded-full bg-background xs:text-sm text-xs font-semibold text-foreground'>
						{formatCountdown(displayedRemainingMs)}
					</div>
				</div>
			</div>
		</div>
	)
}
