'use client'

import { useState } from 'react'
import { Check, Handshake, X } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { CounterOfferModal } from '@/components/ui/modals/CounterOfferModal'
import { useAcceptOffer } from '@/hooks/queries/offers/useAction/useAcceptOffer'
import { useRejectOffer } from '@/hooks/queries/offers/useAction/useRejectOffer'
import type { IOfferShort } from '@/shared/types/Offer.interface'

interface DeskOfferQuickActionsProps {
	offer: IOfferShort
	enableCounter?: boolean
}

export function DeskOfferQuickActions({ offer, enableCounter = false }: DeskOfferQuickActionsProps) {
	const [openCounter, setOpenCounter] = useState(false)
	const { acceptOffer, isLoadingAccept } = useAcceptOffer()
	const { rejectOffer, isLoadingReject } = useRejectOffer()

	const handleAccept = () => acceptOffer(String(offer.id))
	const handleReject = () => rejectOffer(String(offer.id))

	return (
		<>
			<div className='flex items-center gap-3'>
				<Button
					variant='outline'
					size='icon'
					onClick={handleAccept}
					disabled={isLoadingAccept}
					className='rounded-full border-none bg-green-50 text-green-600 hover:bg-green-100 disabled:opacity-60'
				>
					<Check className='size-4' />
				</Button>

				{enableCounter && (
					<Button
						variant='outline'
						size='icon'
						onClick={() => setOpenCounter(true)}
						className='rounded-full border-none bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
					>
						<Handshake className='size-4' />
					</Button>
				)}

				<Button
					variant='outline'
					size='icon'
					onClick={handleReject}
					disabled={isLoadingReject}
					className='rounded-full border-none bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-60'
				>
					<X className='size-4' />
				</Button>
			</div>

			{enableCounter && (
				<CounterOfferModal offer={offer} open={openCounter} onOpenChange={setOpenCounter} />
			)}
		</>
	)
}
