import { RoleEnum } from '../enums/Role.enum'

export interface IMe {
	readonly id: number
	readonly username: string
	readonly email: string

	first_name?: string
	phone?: string | null
	company_name?: string
	photo?: string | null

	readonly role: RoleEnum

	readonly rating_as_customer: number
	readonly rating_as_carrier: number
	readonly is_email_verified: boolean
}

export type PatchedMeDto = Partial<Pick<IMe, 'first_name' | 'phone' | 'company_name' | 'photo'>>

// export type UpdateMe = Partial<Pick<IMe, 'first_name' | 'phone' | 'company_name' | 'photo'>>

export interface RoleChangeDto {
	role: RoleEnum
}

export interface IRoleChangeResponse {
	detail: string
	role?: RoleEnum
}
