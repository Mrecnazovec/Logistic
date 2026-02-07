"use client"

import dynamic from 'next/dynamic'
import { useDeskMyPage } from './hooks/useDeskMyPage'
import { DeskMyView } from './ui/DeskMyView'

const OfferDecisionModal = dynamic(() =>
	import('@/components/ui/modals/OfferDecisionModal').then((mod) => mod.OfferDecisionModal),
)

export function DeskMyPage() {
	const state = useDeskMyPage()
	const viewState = { ...state, role: state.role ?? undefined }

	return (
		<div className='flex h-full flex-col md:gap-4'>
			<DeskMyView {...viewState} />
			<OfferDecisionModal
				key={state.selectedOffer?.id ?? 'empty'}
				offer={state.selectedOffer}
				open={state.isDecisionModalOpen}
				onOpenChange={state.closeDecisionModal}
				statusNote={state.decisionNote}
				allowActions={state.decisionActionable}
			/>
		</div>
	)
}
