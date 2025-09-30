import { RoleEnum } from '../enums/Role.enum'

export interface IRefreshResponse {
	detail: string
}

export interface RegisterDto {
	username: string
	email: string

	password: string
	password2: string

	first_name?: string
	phone: string
	company_name?: string

	role: RoleEnum
}

export interface IRegisterResponse {
	detail: string
}

export interface IResendVerify {
	email: string
}

export interface IResendVerifyResponse {
	detail: string
}

export interface IVerifyEmail {
	email: string
	code: string
}
export interface IVerifyEmailResponse {
	detail: string
	access: string
	refresh: string
}
