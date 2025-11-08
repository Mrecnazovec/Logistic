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
import { usePutLoad } from '@/hooks/queries/loads/usePutLoad'
import { useRefreshLoad } from '@/hooks/queries/loads/useRefreshLoad'
import { ICargoList } from '@/shared/types/CargoList.interface'
import {
	Eye,
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
	const { putLoad, isLoadingPut } = usePutLoad()
	const [open, setOpen] = useState(false)
	const [offerOpen, setOfferOpen] = useState(false)
	const visibilityActionLabel = cargo.is_hidden ? 'Показать' : 'Скрыть'
	const VisibilityIcon = cargo.is_hidden ? Eye : EyeOff

	const handleToggleVisibility = () => {
		putLoad({
			id: cargo.uuid,
			data: {
				product: cargo.product,
				description: cargo.description,
				origin_country: cargo.origin_country,
				origin_city: cargo.origin_city,
				origin_address: cargo.origin_address,
				destination_country: cargo.destination_country,
				destination_city: cargo.destination_city,
				destination_address: cargo.destination_address,
				load_date: cargo.load_date,
				delivery_date: cargo.delivery_date,
				transport_type: cargo.transport_type,
				weight_kg: cargo.weight_kg,
				price_value: cargo.price_value,
				price_currency: cargo.price_currency,
				contact_pref: cargo.contact_pref,
				is_hidden: !cargo.is_hidden,
			},
		})
		setOpen(false)
	}

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
						className='flex items-center gap-2 cursor-pointer'
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
							<Link className='w-full' href={DASHBOARD_URL.edit(cargo.uuid)}>Изменить</Link>
						</DropdownMenuItem>

						<DropdownMenuSeparator />

						<DropdownMenuItem
							onClick={handleToggleVisibility}
							className='flex items-center gap-2'
							disabled={isLoadingPut}
						>
							<VisibilityIcon className='size-4 text-muted-foreground' />
							{visibilityActionLabel}
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

						<DropdownMenuSeparator />

						<DropdownMenuItem
							onClick={() => {
								console.log('Скрыть', cargo.uuid)
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

