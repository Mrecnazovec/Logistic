'use client'

import { useI18n } from '@/i18n/I18nProvider'

export function StatusPage() {
	const { t } = useI18n()

	return (
		<div className='flex h-full w-full items-center justify-center rounded-4xl bg-background p-8 text-center text-muted-foreground'>
			{t('order.shared.status.restricted')}
		</div>
	)
}
