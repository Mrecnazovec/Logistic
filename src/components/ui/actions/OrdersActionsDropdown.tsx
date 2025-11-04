'use client'

import { Button } from '@/components/ui/Button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { DASHBOARD_URL } from '@/config/url.config'
import { ICargoList } from '@/shared/types/CargoList.interface'
import {
	Eye,
	MoreHorizontal,
	Trash2,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface CargoActionsDropdownProps {
	cargo: ICargoList
}

export function OrdersActionsDropdown({ cargo }: CargoActionsDropdownProps) {
	const [open, setOpen] = useState(false)

	return (
		<>
			<DropdownMenu open={open} onOpenChange={setOpen}>
				<DropdownMenuTrigger asChild>
					<Button variant='ghost' className='h-8 w-8 p-0 rotate-90'>
						<span className='sr-only'>Открыть действия</span>
						<MoreHorizontal className='size-4' />
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent align='end'>

					<DropdownMenuItem
						onClick={() => setOpen(false)}
						className='flex items-center gap-2'
					>
						<Eye className='size-4 text-muted-foreground' />
						<Link href={DASHBOARD_URL.order(`${cargo.uuid}`)}>Посмотреть</Link>
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					<DropdownMenuItem
						onClick={() => {
							setOpen(false)
						}}
						className='flex items-center gap-2 text-red-500'
					>
						<Trash2 className='size-4 text-red-500' />
						Удалить
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu >
		</>
	)
}

