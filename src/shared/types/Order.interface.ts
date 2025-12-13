import { RoleEnum } from '../enums/Role.enum'
import type { components, paths } from './api'

type OrderDetailBase = components['schemas']['OrderDetail']

export type OrderRole = {
	id: number
	name: string
	login: string
	phone: string
	company: string
	role: RoleEnum
}

export type IOrderListBase = components['schemas']['OrderList']
export type IOrderList = Omit<IOrderListBase, 'roles'> & {
	roles: {
		customer: OrderRole
		logistic: OrderRole | null
		carrier: OrderRole | null
	}
}

export type IOrderDetail = Omit<OrderDetailBase, 'roles'> & {
	roles: {
		customer: OrderRole
		logistic: OrderRole | null
		carrier: OrderRole | null
	}
}
export type OrderDetailRequestDto = components['schemas']['OrderDetailRequest']
export type PatchedOrderDetailDto = components['schemas']['PatchedOrderDetailRequest']
export type IOrderDocument = components['schemas']['OrderDocument']
export type OrderDocumentRequestDto = components['schemas']['OrderDocumentRequest']
export type IOrderDriverStatusUpdate = components['schemas']['OrderDriverStatusUpdate']
export type IOrderStatusHistory = components['schemas']['OrderStatusHistory']
export type PatchedOrderDriverStatusUpdateDto = components['schemas']['PatchedOrderDriverStatusUpdateRequest']

export type OrdersListQuery = paths['/api/orders/']['get'] extends { parameters: { query?: infer Q } } ? Q : Record<string, never>

export type OrderDocumentUploadDto = Pick<OrderDocumentRequestDto, 'title'> & { file: File }

export type OrderInvitePayload = Partial<OrderDetailRequestDto> & { driver_id?: number; token?: string }

export type DriverStatus = IOrderDriverStatusUpdate['driver_status']
