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
	Trash2,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { OfferModal } from '../modals/OfferModal'

interface CargoActionsDropdownProps {
	cargo: ICargoList
	isOffer?: boolean
}

export function CargoActionsDropdown({ cargo, isOffer = false }: CargoActionsDropdownProps) {
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
					{!isOffer ? <><DropdownMenuItem
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
						</DropdownMenuItem></> : <>
						<DropdownMenuItem
							onClick={() => {
								setOfferOpen(true)
								setOpen(false)
							}}
							className='flex items-center gap-2'
						>
							<Pencil className='size-4 text-muted-foreground' />
							Изменить
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => {
								console.log('Скрыть', cargo.id)
								setOpen(false)
							}}
							className='flex items-center gap-2 text-red-500 focus:text-red-500'
						>
							<Trash2 className='size-4 text-red-500' />
							Удалить
						</DropdownMenuItem>
					</>}
				</DropdownMenuContent>
			</DropdownMenu>

			{!isOffer ? <DeskOfferModal
				open={offerOpen}
				onOpenChange={setOfferOpen}
				selectedRow={cargo}
			/> : <OfferModal open={offerOpen} onOpenChange={setOfferOpen} selectedRow={cargo} isAction />}


		</>
	)
}
