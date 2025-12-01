import type { components, paths } from './api'

export type IOrderList = components['schemas']['OrderList']
export type IOrderDetail = components['schemas']['OrderDetail']
export type OrderDetailRequestDto = components['schemas']['OrderDetailRequest']
export type PatchedOrderDetailDto = components['schemas']['PatchedOrderDetailRequest']
export type IOrderDocument = components['schemas']['OrderDocument']
export type OrderDocumentRequestDto = components['schemas']['OrderDocumentRequest']
export type IOrderDriverStatusUpdate = components['schemas']['OrderDetail']
export type IOrderStatusHistory = components['schemas']['OrderStatusHistory']
export type PatchedOrderDriverStatusUpdateDto = components['schemas']['PatchedOrderDetailRequest'] & {
	driver_status?: components['schemas']['OrderDetail']['driver_status']
}

export type OrdersListQuery = paths['/api/orders/']['get'] extends { parameters: { query?: infer Q } } ? Q : Record<string, never>

export type OrderDocumentUploadDto = Pick<OrderDocumentRequestDto, 'title'> & { file: File }

export type DriverStatus = IOrderDetail['driver_status']
