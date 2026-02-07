import type { ChartConfig } from '@/components/ui/Chart'
import type { IncomeChartDatum } from '../types/cabinet'

type TranslateFn = (...args: any[]) => string

export const getTransportChartConfig = (t: TranslateFn): ChartConfig => ({
	value: { label: t('cabinet.transport.label') },
	search: { label: t('cabinet.transport.search'), color: '#9CA3AF' },
	progress: { label: t('cabinet.transport.progress'), color: '#2563EB' },
	success: { label: t('cabinet.transport.success'), color: '#22C55E' },
	cancelled: { label: t('cabinet.transport.cancelled'), color: '#EF4444' },
})

export const getIncomeChartConfig = (t: TranslateFn): ChartConfig => ({
	given: { label: t('cabinet.income.given'), color: '#FCA5A5' },
	received: { label: t('cabinet.income.received'), color: '#93C5FD' },
	earned: { label: t('cabinet.income.earned'), color: '#86EFAC' },
})

export const getFallbackIncomeChartData = (t: TranslateFn): IncomeChartDatum[] => [
	{ month: t('cabinet.month.jan'), given: 5600, received: 8500, earned: 4300 },
	{ month: t('cabinet.month.feb'), given: 8800, received: 6800, earned: 200 },
	{ month: t('cabinet.month.mar'), given: 2100, received: 3900, earned: 1400 },
	{ month: t('cabinet.month.apr'), given: 5600, received: 10000, earned: 5600 },
	{ month: t('cabinet.month.may'), given: 3200, received: 6200, earned: 2100 },
	{ month: t('cabinet.month.jun'), given: 900, received: 1600, earned: 500 },
]
