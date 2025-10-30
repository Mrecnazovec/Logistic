'use client'

import { Button } from '@/components/ui/Button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { DeskOfferModal } from '@/components/ui/modals/DeskOfferModal'
import { DASHBOARD_URL } from '@/config/url.config'
import { useRefreshLoad } from '@/hooks/queries/loads/useRefreshLoad'
import { ICargoList } from '@/shared/types/CargoList.interface'
import {
	EyeOff,
	Handshake,
	MoreHorizontal,
	Pencil,
	RefreshCcw,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface CargoActionsDropdownProps {
	cargo: ICargoList
}

export function CargoActionsDropdown({ cargo }: CargoActionsDropdownProps) {
	const { refreshLoad } = useRefreshLoad()
	const [open, setOpen] = useState(false)
	const [offerOpen, setOfferOpen] = useState(false)

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
						onClick={() => {
							refreshLoad({ uuid: cargo.uuid, detail: 'Обновить' })
							setOpen(false)
						}}
						className='flex items-center gap-2'
					>
						<RefreshCcw className='size-4 text-muted-foreground' />
						Обновить
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					<DropdownMenuItem
						onClick={() => setOpen(false)}
						className='flex items-center gap-2'
					>
						<Pencil className='size-4 text-muted-foreground' />
						<Link href={DASHBOARD_URL.edit(cargo.uuid)}>Изменить</Link>
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					<DropdownMenuItem
						onClick={() => {
							console.log('Скрыть', cargo.id)
							setOpen(false)
						}}
						className='flex items-center gap-2'
					>
						<EyeOff className='size-4 text-muted-foreground' />
						Скрыть
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					<DropdownMenuItem
						onClick={() => {
							setOpen(false)
							setOfferOpen(true)
						}}
						className='flex items-center gap-2'
					>
						<Handshake className='size-4 text-muted-foreground' />
						Сделать предложение
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<DeskOfferModal
				open={offerOpen}
				onOpenChange={setOfferOpen}
				selectedRow={cargo}
			/>
		</>
	)
}
