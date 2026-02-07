'use client'

import type { ComponentProps } from 'react'
import { OfferDecisionModalView } from './ui/OfferDecisionModalView'

type OfferDecisionModalProps = ComponentProps<typeof OfferDecisionModalView>

export function OfferDecisionModal(props: OfferDecisionModalProps) {
	return <OfferDecisionModalView {...props} />
}