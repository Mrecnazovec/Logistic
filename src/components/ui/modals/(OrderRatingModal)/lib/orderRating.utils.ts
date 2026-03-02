import { RoleEnum } from '@/shared/enums/Role.enum'
import type { IOrderDetail } from '@/shared/types/Order.interface'

export type Participant = {
	id: number
	name: string
	role: RoleEnum
}

type RatedEntry = {
	customer_value?: number
	carrier_value?: number
	logistic_value?: number
	customer_rating_id?: number
	carrier_rating_id?: number
	logistic_rating_id?: number
}

type RatedMap = {
	by_customer?: RatedEntry
	by_carrier?: RatedEntry
	by_logistic?: RatedEntry
}

export const getParticipants = (order: IOrderDetail, meId?: number) => {
	const list: Participant[] = []

	if (order.roles.customer?.id) {
		list.push({
			id: order.roles.customer.id,
			name: order.roles.customer.name,
			role: RoleEnum.CUSTOMER,
		})
	}
	if (order.roles.carrier?.id) {
		list.push({
			id: order.roles.carrier.id,
			name: order.roles.carrier.name,
			role: RoleEnum.CARRIER,
		})
	}
	if (order.roles.logistic?.id) {
		list.push({
			id: order.roles.logistic.id,
			name: order.roles.logistic.name,
			role: RoleEnum.LOGISTIC,
		})
	}

	if (!meId) return list
	return list.filter((participant) => participant.id !== meId)
}

export const getRatedMeta = (order: IOrderDetail, currentRole: RoleEnum | null, targetRole: RoleEnum) => {
	if (!currentRole) return null
	const rated = order.rated as RatedMap | null | undefined
	if (!rated) return null

	const entry =
		currentRole === RoleEnum.CUSTOMER
			? rated.by_customer
			: currentRole === RoleEnum.CARRIER
				? rated.by_carrier
				: currentRole === RoleEnum.LOGISTIC
					? rated.by_logistic
					: null

	if (!entry) return null

	if (targetRole === RoleEnum.CUSTOMER) {
		return { score: entry.customer_value ?? null, ratingId: entry.customer_rating_id ?? null }
	}
	if (targetRole === RoleEnum.CARRIER) {
		return { score: entry.carrier_value ?? null, ratingId: entry.carrier_rating_id ?? null }
	}
	if (targetRole === RoleEnum.LOGISTIC) {
		return { score: entry.logistic_value ?? null, ratingId: entry.logistic_rating_id ?? null }
	}
	return null
}

