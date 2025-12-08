import { axiosWithAuth } from '@/api/api.interceptors'
import { API_URL } from '@/config/api.config'
import type { IPayment, IPaymentCreateResponse, PatchedPaymentRequestDto, PaymentCreateDto } from '@/shared/types/Payment.interface'

type CreatePaymentResponse = IPayment | IPaymentCreateResponse

class PaymentsService {
	async createPayment(data: PaymentCreateDto) {
		const { data: payment } = await axiosWithAuth<CreatePaymentResponse>({
			url: API_URL.payments('create'),
			method: 'POST',
			data,
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
}

export const paymentsService = new PaymentsService()
