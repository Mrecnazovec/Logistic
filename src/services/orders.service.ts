import { axiosWithAuth } from '@/api/api.interceptors'
import { API_URL } from '@/config/api.config'
import {
	IOrderDetail,
	IOrderDocument,
	IOrderStatusUpdate,
	OrderDetailRequestDto,
	OrderDocumentUploadDto,
	OrdersListQuery,
	PatchedOrderDetailDto,
	PatchedOrderStatusUpdateDto,
} from '@/shared/types/Order.interface'
import { IPaginatedOrderListList } from '@/shared/types/PaginatedList.interface'

export type { OrdersListQuery, OrderDocumentUploadDto } from '@/shared/types/Order.interface'

class OrdersService {
	/* GET */

	async getOrders(params?: OrdersListQuery) {
		const { data } = await axiosWithAuth<IPaginatedOrderListList>({
			url: API_URL.root('orders'),
			method: 'GET',
			params,
		})

		return data
	}

	async getOrder(id: string | number) {
		const { data } = await axiosWithAuth<IOrderDetail>({
			url: API_URL.orders(`${id}`),
			method: 'GET',
		})

		return data
	}

	async getOrderDocuments(id: string | number) {
		const { data } = await axiosWithAuth<IOrderDetail>({
			url: API_URL.orders(`${id}/documents`),
			method: 'GET',
		})

		return data
	}

	/* POST */

	async createOrder(data: OrderDetailRequestDto) {
		const { data: createdOrder } = await axiosWithAuth<IOrderDetail>({
			url: API_URL.orders(),
			method: 'POST',
			data,
		})

		return createdOrder
	}

	async uploadOrderDocument(id: string | number, payload: OrderDocumentUploadDto, category: string) {
		const formData = new FormData()

		if (payload.title) {
			formData.append('title', payload.title)
		}

		formData.append('file', payload.file)
		formData.append('category', category)

		const { data } = await axiosWithAuth<IOrderDocument>({
			url: API_URL.orders(`${id}/documents`),
			method: 'POST',
			data: formData,
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})

		return data
	}

	/* PUT */

	async putOrder(id: string | number, data: OrderDetailRequestDto) {
		const { data: updatedOrder } = await axiosWithAuth<IOrderDetail>({
			url: API_URL.orders(`${id}`),
			method: 'PUT',
			data,
		})

		return updatedOrder
	}

	/* PATCH */

	async patchOrder(id: string | number, data: PatchedOrderDetailDto) {
		const { data: patchedOrder } = await axiosWithAuth<IOrderDetail>({
			url: API_URL.orders(`${id}`),
			method: 'PATCH',
			data,
		})

		return patchedOrder
	}

	async updateOrderStatus(id: string | number, data: PatchedOrderStatusUpdateDto) {
		const { data: status } = await axiosWithAuth<IOrderStatusUpdate>({
			url: API_URL.orders(`${id}/status`),
			method: 'PATCH',
			data,
		})

		return status
	}

	/* DELETE */

	async deleteOrder(id: string | number) {
		return axiosWithAuth<void>({
			url: API_URL.orders(`${id}`),
			method: 'DELETE',
		})
	}
}

export const ordersService = new OrdersService()
