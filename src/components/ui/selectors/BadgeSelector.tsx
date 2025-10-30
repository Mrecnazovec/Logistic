import { StatusEnum } from "@/shared/enums/Status.enum"
import { Badge } from "../Badge"

interface BadgeProps {
	status: StatusEnum
}

export function BadgeSelector({ status }: BadgeProps) {
	switch (status) {
		case StatusEnum.POSTED:
			return (
				<Badge variant='outline' className='border-blue-500 text-blue-600 bg-blue-50'>
					Опубликована
				</Badge>
			)

		case StatusEnum.MATCHED:
			return (
				<Badge variant='outline' className='border-amber-500 text-amber-600 bg-amber-50'>
					В работе
				</Badge>
			)

		case StatusEnum.DELIVERED:
			return (
				<Badge variant='outline' className='border-indigo-500 text-indigo-600 bg-indigo-50'>
					Доставлено
				</Badge>
			)

		case StatusEnum.COMPLETED:
			return (
				<Badge variant='outline' className='border-green-500 text-green-600 bg-green-50'>
					Завершено
				</Badge>
			)

		case StatusEnum.CANCELLED:
			return (
				<Badge variant='outline' className='border-red-500 text-red-600 bg-red-50'>
					Отменено
				</Badge>
			)

		default:
			return <Badge variant='secondary'>—</Badge>
	}
}
