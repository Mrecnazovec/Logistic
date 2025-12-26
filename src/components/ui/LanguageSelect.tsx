'use client'

import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/Select'
import type { Locale } from '@/i18n/config'
import { useI18n } from '@/i18n/I18nProvider'
import { languageOptions } from '@/i18n/languages'
import { useLocaleSwitcher } from '@/i18n/useLocaleSwitcher'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { Fragment } from 'react'

type LanguageSelectProps = {
	triggerClassName?: string
	contentClassName?: string
}

export function LanguageSelect({ triggerClassName, contentClassName }: LanguageSelectProps) {
	const { locale, t } = useI18n()
	const { switchLocale } = useLocaleSwitcher()

	return (
		<Select value={locale} onValueChange={(value) => switchLocale(value as Locale)}>
			<SelectTrigger
				className={cn(
					'bg-accent border-none rounded-full text-[16px] hover:bg-accent/80 data-[placeholder]:text-primary text-primary font-medium data-[placeholder]:font-medium px-4 py-3 data-[state=open]:bg-brand-900 data-[state=open]:text-white transition-all ',
					triggerClassName
				)}
				aria-label={t('common.selectLanguage')}
			>
				<SelectValue placeholder={t('common.selectLanguage')} />
			</SelectTrigger>
			<SelectContent className={cn('rounded-2xl', contentClassName)}>
				{languageOptions.map((language, index) => (
					<Fragment key={language.code}>
						<SelectItem value={language.code} className='rounded-2xl' textValue={language.label}>
							<div className='flex items-center gap-2.5 font-medium'>
								<Image className='rounded-full' src={language.flag} width={24} height={24} alt={language.label} />
								{language.label}
							</div>
						</SelectItem>
						{index < languageOptions.length - 1 && <SelectSeparator />}
					</Fragment>
				))}
			</SelectContent>
		</Select>
	)
}
