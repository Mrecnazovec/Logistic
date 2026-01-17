import type { components } from './api'

export type ILogin = components['schemas']['LoginRequest']
export type ILoginResponse = components['schemas']['LoginResponse']
export type IForgotPassword = components['schemas']['ForgotPasswordRequest']
export type IForgotPasswordResponse = components['schemas']['ForgotPasswordResponse']
export type IChangePassword = components['schemas']['ChangePasswordRequest']
export type IChangePasswordResponse = components['schemas']['ChangePasswordResponse']
export type ITokenRefreshRequest = components['schemas']['TokenRefreshRequestRequest']
export type ITokenRefreshResponse = components['schemas']['TokenRefreshResponse']
