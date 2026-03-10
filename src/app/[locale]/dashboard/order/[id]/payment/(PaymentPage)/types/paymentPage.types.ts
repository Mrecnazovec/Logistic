import type { OrderRole } from '@/shared/types/Order.interface'

export type PaymentPageTranslator = (key: string, params?: Record<string, string | number>) => string

export type PaymentSection = {
	key: 'customer' | 'carrier' | 'logistic'
	title: string
	role: OrderRole | null
	confirmation: boolean
}

export type PaymentConfirmAction = {
	label: string
	isConfirmed: boolean
	isLoading: boolean
	onConfirm: () => void
}
