import { axiosClassic, axiosWithAuth } from '@/api/api.interceptors'
import { API_URL } from '@/config/api.config'
import {
	IOrderDetail,
	IOrderDocument,
	IOrderDriverStatusUpdate,
	IOrderStatusHistory,
	InvitePreview,
	OrderAcceptInviteResponse,
	OrderDetailRequestDto,
	OrderDocumentUploadDto,
	OrderDetailQuery,
	OrdersListQuery,
	OrderInvitePayload,
	PatchedOrderDetailDto,
	PatchedOrderDriverStatusUpdateDto,
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

	async getOrder(id: string | number, params?: OrderDetailQuery) {
		const { data } = await axiosWithAuth<IOrderDetail>({
			url: API_URL.orders(`${id}`),
			method: 'GET',
			params,
		})

		return data
	}

	async getSharedOrder(shareToken: string) {
		const { data } = await axiosClassic<IOrderDetail>({
			url: API_URL.orders(`orders/shared/${shareToken}`),
			method: 'GET',
		})

		return data
	}

	async getInvitePreview(token: string) {
		const { data } = await axiosClassic<InvitePreview>({
			url: API_URL.orders('invite-preview'),
			method: 'GET',
			params: { token },
		})

		return data
	}

	async getOrderDocuments(id: string | number, params?: OrderDetailQuery) {
		const { data } = await axiosWithAuth<IOrderDocument[] | IOrderDetail>({
			url: API_URL.orders(`${id}/documents`),
			method: 'GET',
			params,
		})

		return data
	}

	async getOrderStatusHistory(id: string | number, params?: OrderDetailQuery) {
		const { data } = await axiosWithAuth<IOrderStatusHistory[]>({
			url: API_URL.orders(`${id}/status-history`),
			method: 'GET',
			params,
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

	async generateOrderInvite(id: string | number, payload: OrderInvitePayload) {
		const { data } = await axiosWithAuth<IOrderDetail>({
			url: API_URL.orders(`${id}/generate-invite`),
			method: 'POST',
			data: payload,
		})

		return data
	}

	async inviteOrderById(id: string | number, payload: OrderInvitePayload) {
		const { data } = await axiosWithAuth<IOrderDetail>({
			url: API_URL.orders(`${id}/invite-by-id`),
			method: 'POST',
			data: payload,
		})

		return data
	}

	async acceptOrderInvite(payload: OrderInvitePayload) {
		const { data } = await axiosWithAuth<OrderAcceptInviteResponse>({
			url: API_URL.orders('accept-invite'),
			method: 'POST',
			data: payload,
		})

		return data
	}

	async declineOrderInvite(payload: OrderInvitePayload) {
		const { data } = await axiosWithAuth<IOrderDetail>({
			url: API_URL.orders('decline-invite'),
			method: 'POST',
			data: payload,
		})

		return data
	}

	async confirmOrderTerms(id: string | number) {
		const { data: order } = await axiosWithAuth<IOrderDetail>({
			url: API_URL.orders(`${id}/confirm-terms`),
			method: 'POST',
		})

		return order
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

	async updateDriverStatus(id: string | number, data: PatchedOrderDriverStatusUpdateDto) {
		const { data: status } = await axiosWithAuth<IOrderDriverStatusUpdate>({
			url: API_URL.orders(`${id}/driver-status`),
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
