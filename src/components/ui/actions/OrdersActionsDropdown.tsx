'use client'

import Link from 'next/link'
import { Eye, MoreHorizontal, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { DASHBOARD_URL } from '@/config/url.config'
import { useI18n } from '@/i18n/I18nProvider'
import { ICargoList } from '@/shared/types/CargoList.interface'

interface CargoActionsDropdownProps {
	cargo: ICargoList
}

export function OrdersActionsDropdown({ cargo }: CargoActionsDropdownProps) {
	const { t } = useI18n()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='ghost' className='h-8 w-8 p-0 rotate-90'>
					<span className='sr-only'>{t('components.ordersActions.open')}</span>
					<MoreHorizontal className='size-4' />
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align='end'>
				<DropdownMenuItem asChild className='flex items-center gap-2'>
					<Link href={DASHBOARD_URL.order(`${cargo.uuid}`)}>
						<Eye className='size-4 text-muted-foreground' />
						{t('components.ordersActions.view')}
					</Link>
				</DropdownMenuItem>

				<DropdownMenuSeparator />

				<DropdownMenuItem className='flex items-center gap-2 text-red-500 hover:text-red-500'>
					<Trash2 className='size-4 text-red-500' />
					{t('components.ordersActions.delete')}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
