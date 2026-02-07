'use client'

import type { ComponentProps } from 'react'
import { OrderRatingModalView } from './ui/OrderRatingModalView'

type OrderRatingModalProps = ComponentProps<typeof OrderRatingModalView>

export function OrderRatingModal(props: OrderRatingModalProps) {
	return <OrderRatingModalView {...props} />
}