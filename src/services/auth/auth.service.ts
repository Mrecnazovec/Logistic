import { axiosClassic, axiosWithAuth } from '@/api/api.interceptors'
import { API_URL } from '@/config/api.config'
import {
	IForgotPassword,
	IForgotPasswordResponse,
	ILogin,
	ILoginResponse,
	IResetPassword,
	IResetPasswordResponse,
	ITokenRefreshRequest,
	ITokenRefreshResponse,
} from '@/shared/types/Login.interface'
import { removeFromStorage, saveTokenStorage } from './auth-token.service'
import { IRoleChangeResponse, RoleChangeDto } from '@/shared/types/Me.interface'
import type { IDashboardStats } from '@/shared/types/DashboardStats.interface'
import { ILogoutResponse } from '@/shared/types/Logout.interface'
import {
	IRegisterResponse,
	IResendVerifyResponse,
	ISendPhoneOtp,
	ISendPhoneOtpResponse,
	IVerifyEmail,
	IVerifyEmailResponse,
	IVerifyPhoneOtp,
	IVerifyPhoneOtpResponse,
	RegisterDto,
	RegisterRequestPayload,
} from '@/shared/types/Registration.interface'

class AuthService {
	/* POST */

	async login(data: ILogin) {
		const { data: result } = await axiosClassic<ILoginResponse>({
			url: API_URL.auth('login'),
			method: 'POST',
			data,
		})

		if (result.access) saveTokenStorage(result.access)

		return result
	}

	async register(data: RegisterDto) {
		const { transport_name: _transport, car_number: _car, trailer_number: _trailer, ...payload } = data

		const { data: result } = await axiosClassic<IRegisterResponse>({
			url: API_URL.auth('register'),
			method: 'POST',
			data: payload as RegisterRequestPayload,
		})

		return result
	}

	async logout(refresh?: string) {
		const { data: result } = await axiosWithAuth<ILogoutResponse>({
			url: API_URL.auth('logout'),
			method: 'POST',
			data: refresh ? { refresh } : {},
		})

		removeFromStorage()
		return result
	}

	async getNewTokens(data: ITokenRefreshRequest) {
		const { data: result } = await axiosClassic<ITokenRefreshResponse>({
			url: API_URL.auth('refresh'),
			method: 'POST',
			data,
		})

		if (result.access) {
			saveTokenStorage(result.access)
		}

		return result
	}

	async changeRole(data: RoleChangeDto) {
		const { data: result } = await axiosWithAuth<IRoleChangeResponse>({
			url: API_URL.auth('change-role'),
			method: 'POST',
			data,
		})

		return result
	}

	async forgotPassword(data: IForgotPassword) {
		const { data: result } = await axiosClassic<IForgotPasswordResponse>({
			url: API_URL.auth('forgot-password'),
			method: 'POST',
			data,
		})

		return result
	}

	async resendVerify(email: string) {
		const { data: result } = await axiosClassic<IResendVerifyResponse>({
			url: API_URL.auth('resend-verify'),
			method: 'POST',
			data: { email },
		})

		return result
	}

	async sendPhoneOtp(data: ISendPhoneOtp) {
		const { data: result } = await axiosClassic<ISendPhoneOtpResponse>({
			url: API_URL.auth('send-otp/phone'),
			method: 'POST',
			data,
		})

		return result
	}

	async verifyPhoneOtp(data: IVerifyPhoneOtp) {
		const { data: result } = await axiosClassic<IVerifyPhoneOtpResponse>({
			url: API_URL.auth('verify-otp/phone'),
			method: 'POST',
			data,
		})

		return result
	}

	async resetPassword(data: IResetPassword) {
		const { data: result } = await axiosClassic<IResetPasswordResponse>({
			url: API_URL.auth('reset-password'),
			method: 'POST',
			data,
		})

		return result
	}

	async verifyEmail(data: IVerifyEmail) {
		const { data: result } = await axiosClassic<IVerifyEmailResponse>({
			url: API_URL.auth('verify-email'),
			method: 'POST',
			data,
		})

		if (result.access) saveTokenStorage(result.access)
		return result
	}

	async getDashboardStats() {
		const { data: result } = await axiosWithAuth<IDashboardStats>({
			url: API_URL.auth('dashboard-stats'),
			method: 'GET',
		})

		return result
	}
}

export const authService = new AuthService()
