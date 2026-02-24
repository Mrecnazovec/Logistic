import { OrderStatusEnum } from '../enums/OrderStatus.enum'
import { PriceCurrencyEnum } from '../enums/PriceCurrency.enum'
import { RoleEnum } from '../enums/Role.enum'
import type { IPayment } from './Payment.interface'
import type { components, paths } from './api'

type OrderDetailBase = components['schemas']['OrderDetail']

export type OrderRole = {
	id: number
	name: string
	login: string
	phone: string
	email?: string
	company: string
	role: RoleEnum
	hidden?: boolean
	hidden_by?: boolean
}

export type IOrderListBase = components['schemas']['OrderList']
export type IOrderList = Omit<IOrderListBase, 'roles'> & {
	roles: {
		customer: OrderRole
		logistic: OrderRole | null
		carrier: OrderRole | null
	}
}

export type IOrderDetail = Omit<OrderDetailBase, 'roles' | 'payment' | 'status'> & {
	roles: {
		customer: OrderRole
		logistic: OrderRole | null
		carrier: OrderRole | null
	}
	payment: IPayment | null
	status: OrderStatusEnum
}
export type OrderDetailRequestDto = components['schemas']['OrderDetailRequest']
export type PatchedOrderDetailDto = components['schemas']['PatchedOrderDetailRequest']
export type IOrderDocument = components['schemas']['OrderDocument']
export type InvitePreview = components['schemas']['InvitePreview']
export type OrderDocumentRequestDto = components['schemas']['OrderDocumentRequest']
export type IOrderDriverStatusUpdate = components['schemas']['OrderDriverStatusUpdate']
export type IOrderStatusHistory = components['schemas']['OrderStatusHistory']
export type PatchedOrderDriverStatusUpdateDto = components['schemas']['PatchedOrderDriverStatusUpdateRequest']

export type OrdersListQuery = (paths['/api/orders/']['get'] extends { parameters: { query?: infer Q } } ? Q : Record<string, never>) & {
	as_role?: string
}
export type OrderDetailQuery = { as_role?: 'customer' }

export type OrderDocumentUploadDto = Pick<OrderDocumentRequestDto, 'title'> & { file: File }

export type DriverPaymentMethod = 'cash' | 'bank_transfer' | 'both'

export type OrderInvitePayload = Partial<OrderDetailRequestDto> & {
	driver_id?: number
	token?: string
	driver_price?: string | number
	driver_currency?: PriceCurrencyEnum
	driver_payment_method?: DriverPaymentMethod
}

export type OrderAcceptInviteResponse = {
	detail: string
	order_id: number
	driver_price?: string | number
	next_action?: string
}

export type DriverStatus = IOrderDriverStatusUpdate['driver_status']
export type IGpsUpdate = components['schemas']['GPSUpdate']
export type GpsUpdateRequestDto = components['schemas']['GPSUpdateRequest']
