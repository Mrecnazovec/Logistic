'use client'

import { Button } from '@/components/ui/Button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import {
	MoreHorizontal,
	Pencil,
	Trash2,
} from 'lucide-react'
import { useState } from 'react'
import { IOfferShort } from '@/shared/types/Offer.interface'

interface CargoActionsDropdownProps {
	cargo: IOfferShort
}

export function DeskMyActions({ cargo }: CargoActionsDropdownProps) {
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
							console.log('Скрыть', cargo.id)
							setOpen(false)
						}}
						className='flex items-center gap-2 text-red-500 focus:text-red-500'
					>
						<Trash2 className='size-4 text-red-500' />
						Удалить
					</DropdownMenuItem>

				</DropdownMenuContent>
			</DropdownMenu>

		</>
	)
}

