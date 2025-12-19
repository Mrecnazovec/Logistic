import { axiosWithAuth } from '@/api/api.interceptors'
import { API_URL } from '@/config/api.config'
import type { IPayment, PatchedPaymentRequestDto } from '@/shared/types/Payment.interface'

class PaymentsService {
	async getPayment(id: number | string) {
		const { data: payment } = await axiosWithAuth<IPayment>({
			url: API_URL.payments(`${id}`),
			method: 'GET',
		})

		return payment
	}

	async confirmPaymentCustomer(id: number | string, data?: PatchedPaymentRequestDto) {
		const { data: payment } = await axiosWithAuth<IPayment>({
			url: API_URL.payments(`${id}/confirm/customer`),
			method: 'PATCH',
			data,
		})

		return payment
	}

	async confirmPaymentCarrier(id: number | string, data?: PatchedPaymentRequestDto) {
		const { data: payment } = await axiosWithAuth<IPayment>({
			url: API_URL.payments(`${id}/confirm/carrier`),
			method: 'PATCH',
			data,
		})

		return payment
	}

	async confirmPaymentLogistic(id: number | string, data?: PatchedPaymentRequestDto) {
		const { data: payment } = await axiosWithAuth<IPayment>({
			url: API_URL.payments(`${id}/confirm/logistic`),
			method: 'PATCH',
			data,
		})

		return payment
	}
}

export const paymentsService = new PaymentsService()
