import { Badge } from '@/components/ui/Badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/DropdownMenu'
import type { DriverStatus } from '@/shared/types/Order.interface'

type DriverStatusMeta = { label: string; variant: 'success' | 'warning' | 'info' | 'danger' | 'secondary' } | null

type Props = {
	t: (...args: any[]) => string
	canChangeDriverStatus: boolean
	isLoadingUpdateStatus: boolean
	driverStatusMeta: DriverStatusMeta
	driverStatusEntries: Array<[DriverStatus, { label: string; variant: 'success' | 'warning' | 'info' | 'danger' | 'secondary' }]>
	currentDriverStatus: DriverStatus | null
	onSelectStatus: (status: DriverStatus) => void
}

export function OrderDriverStatusFloating({
	t,
	canChangeDriverStatus,
	isLoadingUpdateStatus,
	driverStatusMeta,
	driverStatusEntries,
	currentDriverStatus,
	onSelectStatus,
}: Props) {
	if (!canChangeDriverStatus) return null

	return (
		<div className='fixed md:bottom-6 bottom-20 right-6 z-50'>
			<DropdownMenu>
				<DropdownMenuTrigger asChild disabled={isLoadingUpdateStatus}>
					<button type='button' className='outline-none' aria-label={t('order.driverStatus.changeLabel')} disabled={isLoadingUpdateStatus}>
						<Badge
							variant={driverStatusMeta?.variant ?? 'secondary'}
							className='cursor-pointer px-4 py-2 text-sm shadow-lg data-[state=open]:ring-2 data-[state=open]:ring-ring'
						>
							{isLoadingUpdateStatus
								? t('order.driverStatus.updating')
								: driverStatusMeta
									? driverStatusMeta.label
									: t('order.driverStatus.select')}
						</Badge>
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end'>
					{driverStatusEntries.map(([status, meta]) => (
						<DropdownMenuItem
							key={status}
							onSelect={() => onSelectStatus(status)}
							disabled={isLoadingUpdateStatus || status === currentDriverStatus}
							className='focus:bg-transparent focus:text-foreground'
						>
							<Badge variant={meta.variant} className='w-full justify-center text-sm'>
								{meta.label}
							</Badge>
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}
