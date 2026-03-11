import { Badge } from '@/components/ui/Badge'
import type { VariantProps } from 'class-variance-authority'
import type { badgeVariants } from '@/components/ui/Badge'

type SharedOrderStatusHeaderProps = {
	statusLabel: string
	statusVariant: VariantProps<typeof badgeVariants>['variant']
}

export function SharedOrderStatusHeader({ statusLabel, statusVariant }: SharedOrderStatusHeaderProps) {
	return (
		<div className='flex flex-wrap items-center gap-3'>
			<Badge variant={statusVariant}>{statusLabel}</Badge>
		</div>
	)
}
