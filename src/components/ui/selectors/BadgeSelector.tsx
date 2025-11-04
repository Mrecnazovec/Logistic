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
					Завершено
				</Badge>
			)

		case StatusEnum.CANCELLED:
			return (
				<Badge variant='danger'>
					Отменено
				</Badge>
			)

		default:
			return <Badge variant='secondary'>—</Badge>
	}
}
