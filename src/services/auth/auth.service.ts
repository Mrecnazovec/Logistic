import { axiosClassic, axiosWithAuth } from '@/api/api.interceptors'
import { API_URL } from '@/config/api.config'
import {
	IForgotPassword,
	IForgotPasswordResponse,
	ILogin,
	ILoginResponse,
	IResetPassword,
	IResetPasswordResponse,
} from '@/shared/types/Login.interface'
import { removeFromStorage, saveTokenStorage } from './auth-token.service'
import { IRoleChangeResponse, RoleChangeDto } from '@/shared/types/Me.interface'
import { ILogoutRequest, ILogoutResponse } from '@/shared/types/Logout.interface'
import { IRegisterResponse, IResendVerifyResponse, IVerifyEmail, IVerifyEmailResponse, RegisterDto } from '@/shared/types/Registration.interface'

class AuthService {
	async login(data: ILogin) {
		const response = await axiosClassic<ILoginResponse>({
			url: API_URL.auth('login'),
			method: 'POST',
			data,
		})

		if (response.data.access) saveTokenStorage(response.data.access)

		return response
	}

	async register(data: RegisterDto) {
		const response = await axiosClassic<IRegisterResponse>({
			url: API_URL.auth('register'),
			method: 'POST',
			data,
		})

		return response
	}

	async logout(refresh?: string) {
		const response = await axiosWithAuth<ILogoutResponse>({
			url: API_URL.auth('logout'),
			method: 'POST',
			data: refresh ? { refresh } : {},
		})

		removeFromStorage()
		return response
	}

	async getNewTokens() {
		const response = await axiosClassic<ILoginResponse>({
			url: API_URL.auth('refresh'),
			method: 'POST',
		})

		if (response.data.access) saveTokenStorage(response.data.access)

		return response
	}

	async changeRole(data: RoleChangeDto) {
		const response = await axiosWithAuth<IRoleChangeResponse>({
			url: API_URL.auth('change-role'),
			method: 'POST',
			data,
		})

		return response
	}

	async forgotPassword(data: IForgotPassword) {
		const response = await axiosClassic<IForgotPasswordResponse>({
			url: API_URL.auth('forgot-password'),
			method: 'POST',
			data,
		})

		return response
	}

	async resendVerify(email: string) {
		const response = await axiosClassic<IResendVerifyResponse>({
			url: API_URL.auth('resend-verify'),
			method: 'POST',
			data: { email },
		})

		return response
	}

	async resetPassword(data: IResetPassword) {
		const response = await axiosClassic<IResetPasswordResponse>({
			url: API_URL.auth('reset-password'),
			method: 'POST',
			data,
		})

		return response
	}

	async verifyEmail(data: IVerifyEmail) {
		const response = await axiosClassic<IVerifyEmailResponse>({
			url: API_URL.auth('verify-email'),
			method: 'POST',
			data,
		})

		if (response.data.access) saveTokenStorage(response.data.access)
		return response
	}
}

export const authService = new AuthService()
