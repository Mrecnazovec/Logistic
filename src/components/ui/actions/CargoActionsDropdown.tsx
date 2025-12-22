'use client'

import { Button } from '@/components/ui/Button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { DeskInviteModal } from '@/components/ui/modals/DeskInviteModal'
import { OfferModal } from '@/components/ui/modals/OfferModal'
import { DASHBOARD_URL } from '@/config/url.config'
import { useRefreshLoad } from '@/hooks/queries/loads/useRefreshLoad'
import { useToggleLoadVisibility } from '@/hooks/queries/loads/useToggleLoadVisibility'
import { ICargoList } from '@/shared/types/CargoList.interface'
import { Eye, EyeOff, Handshake, MoreHorizontal, Pencil, RefreshCcw } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface CargoActionsDropdownProps {
	cargo: ICargoList
	isOffer?: boolean
}

export function CargoActionsDropdown({ cargo, isOffer = false }: CargoActionsDropdownProps) {
	const { refreshLoad } = useRefreshLoad()
	const { toggleLoadVisibility, isLoadingToggle } = useToggleLoadVisibility()
	const [open, setOpen] = useState(false)
	const [offerOpen, setOfferOpen] = useState(false)
	const isHidden = Boolean(cargo.is_hidden)
	const visibilityActionLabel = isHidden ? 'Показать' : 'Скрыть'
	const VisibilityIcon = isHidden ? Eye : EyeOff

	const handleToggleVisibility = () => {
		toggleLoadVisibility({ uuid: cargo.uuid, isHidden: !isHidden })
		setOpen(false)
	}

	return (
		<>
			<DropdownMenu open={open} onOpenChange={setOpen}>
				<DropdownMenuTrigger asChild>
					<Button variant='ghost' className='h-8 w-8 p-0 rotate-90'>
						<span className='sr-only'>Открыть меню действий</span>
						<MoreHorizontal className='size-4' />
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent align='end'>
					<DropdownMenuItem
						onClick={() => {
							refreshLoad({ uuid: cargo.uuid, detail: 'Обновление объявления' })
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
						className='flex items-center gap-2 cursor-pointer'
					>
						<Pencil className='size-4 text-muted-foreground' />
						<Link className='w-full' href={DASHBOARD_URL.edit(cargo.uuid)}>
							Изменить
						</Link>
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					<DropdownMenuItem
						onClick={handleToggleVisibility}
						className='flex items-center gap-2 cursor-pointer'
						disabled={isLoadingToggle}
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
						className='flex items-center gap-2 cursor-pointer'
					>
						<Handshake className='size-4 text-muted-foreground' />
						Отправить предложение
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{!isOffer ? (
				<DeskInviteModal open={offerOpen} onOpenChange={setOfferOpen} selectedRow={cargo} />
			) : (
				<OfferModal open={offerOpen} onOpenChange={setOfferOpen} selectedRow={cargo} isAction />
			)}
		</>
	)
}
