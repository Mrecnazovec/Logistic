'use client'

import { useState } from 'react'
import { MoreHorizontal, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { useI18n } from '@/i18n/I18nProvider'
import { IOfferShort } from '@/shared/types/Offer.interface'

interface CargoActionsDropdownProps {
	cargo: IOfferShort
	onOpenDecision?: (offer: IOfferShort, options?: { forceFull?: boolean }) => void
}

export function DeskMyActions({ cargo, onOpenDecision }: CargoActionsDropdownProps) {
	const { t } = useI18n()
	const [open, setOpen] = useState(false)

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
					onClick={(event) => {
						event.preventDefault()
						event.stopPropagation()
						onOpenDecision?.(cargo, { forceFull: true })
						setOpen(false)
					}}
					className='flex items-center gap-2'
				>
					<Pencil className='size-4 text-muted-foreground' />
					{t('components.deskMyActions.edit')}
				</DropdownMenuItem>

			</DropdownMenuContent>
		</DropdownMenu>
	)
}
