import { IMe } from './Me.interface'

export interface ILogin {
	login: string
	password: string
	remember_me: boolean
}

export interface ILoginResponse {
	user: IMe
	access: string
	refresh: string
}

export interface IForgotPassword {
	email: string
}

export interface IForgotPasswordResponse {
	detail: string
}

export interface IResetPassword {
	email: string
	code: string
	new_password: string
}

export interface IResetPasswordResponse {
	detail: string
}

export interface ITokenRefreshRequest {
	refresh: string
	remember_me?: boolean
}

export interface ITokenRefreshResponse {
	access: string
	refresh: string
}