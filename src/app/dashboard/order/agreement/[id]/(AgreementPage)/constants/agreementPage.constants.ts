import type { IAgreementDetail } from '@/shared/types/Agreement.interface'

export const EMPTY_VALUE = '-'

export const AGREEMENT_STATUS_CLASSNAMES: Record<IAgreementDetail['status'], string> = {
	pending: 'bg-warning-100 text-warning-700 border border-warning-200',
	accepted: 'bg-success-100 text-success-700 border border-success-200',
	expired: 'bg-muted text-muted-foreground border border-border',
	cancelled: 'bg-error-100 text-error-700 border border-error-200',
}
