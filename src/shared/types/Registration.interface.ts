import type { components } from './api'

type ApiRegisterRequest = components['schemas']['RegisterRequest']
export type RegisterRequestPayload = ApiRegisterRequest
type CarrierExtras = Partial<{
	transport_name: string
	car_number: string
	trailer_number: string
}>

export type IRefreshResponse = components['schemas']['RefreshResponse']
export type RegisterDto = ApiRegisterRequest & CarrierExtras
export type IRegisterResponse = components['schemas']['RegisterResponse']
export type IResendVerify = components['schemas']['ResendVerifyRequest']
export type IResendVerifyResponse = components['schemas']['ResendVerifyResponse']
export type IVerifyEmail = components['schemas']['VerifyEmailRequest']
export type IVerifyEmailResponse = components['schemas']['VerifyEmailResponse']
