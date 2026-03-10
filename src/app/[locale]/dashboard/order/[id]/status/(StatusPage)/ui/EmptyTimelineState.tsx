import { useI18n } from '@/i18n/I18nProvider'

export function EmptyTimelineState() {
	const { t } = useI18n()

	return (
		<div className='flex h-full flex-col items-center justify-center gap-2 text-center'>
			<p className='text-lg font-semibold text-foreground'>{t('order.status.empty.title')}</p>
			<p className='text-sm text-muted-foreground'>{t('order.status.empty.description')}</p>
		</div>
	)
}
