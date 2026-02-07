'use client'

import type { ComponentProps } from 'react'
import { DeskOffersModalView } from './ui/DeskOffersModalView'

type DeskOffersModalProps = ComponentProps<typeof DeskOffersModalView>

export function DeskOffersModal(props: DeskOffersModalProps) {
	return <DeskOffersModalView {...props} />
}