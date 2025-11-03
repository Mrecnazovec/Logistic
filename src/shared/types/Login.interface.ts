import type { components } from './api'

export type ILogin = components['schemas']['LoginRequest']
export type ILoginResponse = components['schemas']['LoginResponse']
export type IForgotPassword = components['schemas']['ForgotPasswordRequest']
export type IForgotPasswordResponse = components['schemas']['ForgotPasswordResponse']
export type IResetPassword = components['schemas']['ResetPasswordRequest']
export type IResetPasswordResponse = components['schemas']['ResetPasswordResponse']
export type ITokenRefreshRequest = components['schemas']['TokenRefreshRequestRequest']
export type ITokenRefreshResponse = components['schemas']['TokenRefreshResponse']
