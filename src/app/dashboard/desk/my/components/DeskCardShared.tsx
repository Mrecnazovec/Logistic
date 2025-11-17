'use client'

import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { formatCurrencyPerKmValue, formatCurrencyValue } from '@/shared/utils/currency'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export type InfoSectionProps = {
	title: string
	children: ReactNode
}

export function InfoSection({ title, children }: InfoSectionProps) {
	return (
		<section className='flex flex-col gap-2'>
			<span className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>{title}</span>
			<div className='flex flex-wrap gap-2'>{children}</div>
		</section>
	)
}

export type InfoChipProps = {
	icon: LucideIcon
	primary: string
	secondary?: string
	className?: string
}

export function InfoChip({ icon: Icon, primary, secondary, className }: InfoChipProps) {
	return (
		<div
			className={cn(
				'flex min-w-[160px] flex-1 items-center gap-2 rounded-full bg-card px-4 py-2',
				className,
			)}
		>
			<Icon className='size-4 text-muted-foreground' aria-hidden />
			<div className='flex flex-col leading-tight'>
				<span className='font-medium text-foreground'>{primary}</span>
				{secondary ? <span className='text-xs text-muted-foreground'>{secondary}</span> : null}
			</div>
		</div>
	)
}

export type ActionButtonProps = React.ComponentProps<typeof Button> & {
	label: string
}

export function ActionButton({ label, className, ...props }: ActionButtonProps) {
	return (
		<Button
			type='button'
			variant='outline'
			className={cn('min-w-[120px] flex-1 border-none text-sm font-semibold', className)}
			{...props}
		>
			{label}
		</Button>
	)
}

export function formatDate(value?: string | null) {
	if (!value) return '—'

	try {
		return format(new Date(value), 'dd.MM.yyyy', { locale: ru })
	} catch {
		return '—'
	}
}

export function formatWeight(weight?: number | null) {
	if (!weight) return '—'
	return `${weight.toLocaleString('ru-RU')} т`
}

export function formatPrice(value?: string | null, currency?: string | null) {
	return formatCurrencyValue(value, currency)
}

export function formatPricePerKm(value?: number | null, currency?: string | null) {
	return formatCurrencyPerKmValue(value, currency)
}
