import { StatusEnum } from "@/shared/enums/Status.enum"
import { Badge } from "../Badge"

interface BadgeProps {
	status: StatusEnum
}

export function BadgeSelector({ status }: BadgeProps) {
	switch (status) {
		case StatusEnum.POSTED:
			return (
				<Badge variant='info'>
					Опубликована
				</Badge>
			)

		case StatusEnum.MATCHED:
			return (
				<Badge variant='warning'>
					В работе
				</Badge>
			)

		case StatusEnum.DELIVERED:
			return (
				<Badge variant='info'>
					Доставлено
				</Badge>
			)

		case StatusEnum.COMPLETED:
			return (
				<Badge variant='success'>
					Ответ получен
				</Badge>
			)

		case StatusEnum.CANCELLED:
			return (
				<Badge variant='danger'>
					Ожидает ответа
				</Badge>
			)

		default:
			return <Badge variant='secondary'>—</Badge>
	}
}

export const getStatusBadge = (status?: string) => {
	const normalized = (status || '').toLowerCase()
	if (normalized.includes('ожидает')) return { variant: 'warning' as const, label: status }
	if (normalized.includes('получен')) return { variant: 'success' as const, label: status }
	if (normalized.includes('отм')) return { variant: 'danger' as const, label: status }
	return { variant: 'secondary' as const, label: status || '—' }
}