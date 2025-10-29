import { RoleEnum } from '../enums/Role.enum'

interface IProfile {
	country: string
	country_code: string
	region: string
	city: string
}

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

	profile: IProfile
}

export type PatchedMeDto = Partial<Pick<IMe, 'first_name' | 'phone' | 'company_name' | 'photo'>>

export type UpdateMeDto = Partial<Pick<IMe, 'first_name' | 'phone' | 'company_name' | 'photo'>>

export interface RoleChangeDto {
	role: RoleEnum
}

export interface IRoleChangeResponse {
	detail: string
	role?: RoleEnum
}
