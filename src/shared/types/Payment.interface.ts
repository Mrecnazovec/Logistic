import type { components } from './api'

export type IPayment = components['schemas']['Payment']
export type PatchedPaymentRequestDto = components['schemas']['PatchedPaymentRequest']

export type PaymentMethod = IPayment['method']
export type PaymentStatus = IPayment['status']
