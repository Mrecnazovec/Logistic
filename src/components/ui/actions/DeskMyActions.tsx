'use client'

import { useState } from 'react'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { useI18n } from '@/i18n/I18nProvider'
import { IOfferShort } from '@/shared/types/Offer.interface'

interface CargoActionsDropdownProps {
	cargo: IOfferShort
}

export function DeskMyActions({ cargo }: CargoActionsDropdownProps) {
	const { t } = useI18n()
	const [open, setOpen] = useState(false)
	const [offerOpen, setOfferOpen] = useState(false)

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild>
				<Button variant='ghost' className='h-8 w-8 p-0 rotate-90'>
					<span className='sr-only'>{t('components.deskMyActions.open')}</span>
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
					{t('components.deskMyActions.edit')}
				</DropdownMenuItem>

				<DropdownMenuSeparator />

				<DropdownMenuItem
					onClick={() => {
						console.log(t('components.deskMyActions.hideLog'), cargo.id)
						setOpen(false)
					}}
					className='flex items-center gap-2 text-red-500 focus:text-red-500'
				>
					<Trash2 className='size-4 text-red-500' />
					{t('components.deskMyActions.delete')}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
