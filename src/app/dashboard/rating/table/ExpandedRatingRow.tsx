'use client'

import { RoleSelect } from '@/shared/enums/Role.enum'
import { IRatingUserList } from '@/shared/types/Rating.interface'
import { format } from 'date-fns'

const roleLabels: Record<IRatingUserList['role'], string> = {
	LOGISTIC: 'Logistic',
	CUSTOMER: 'Customer',
	CARRIER: 'Carrier',
}

const formatNumber = (value?: number | null) => {
	if (value === null || value === undefined) return '-'

	return value.toLocaleString('ru-RU')
}

export function ExpandedRatingRow({ user }: { user: IRatingUserList }) {
	const registeredAt = user.registered_at
		? format(new Date(user.registered_at), 'dd.MM.yyyy')
		: '-'

	const stats = [
		{
			label: 'Общий рейтинг',
			value: `${user.avg_rating ? user.avg_rating.toFixed(1) : '—'} / ${user.rating_count.toLocaleString('ru-RU')} отзывов`,
		},
		{
			label: 'Выполненных заказов',
			value: formatNumber(user.completed_orders),
		},
		{
			label: 'Пройденная дистанция',
			value: formatNumber(user.total_distance),
		},
		{
			label: 'Зарегистрирован с',
			value: registeredAt,
		},
	]

	return (
		<div className='grid gap-6 md:grid-cols-2'>
			<div className='space-y-3'>
				<div>
					<p className='text-sm text-muted-foreground'>Компания</p>
					<p className='text-base font-semibold text-foreground'>{user.company_name ?? '-'}</p>
				</div>
				<div>
					<p className='text-sm text-muted-foreground'>Имя</p>
					<p className='text-base font-medium text-foreground'>{user.display_name ?? '-'}</p>
				</div>
				<div>
					<p className='text-sm text-muted-foreground'>Роль</p>
					<p className='text-base font-medium text-foreground'>{RoleSelect.find((type) => type.type === user.role)?.name}</p>
				</div>
				<div>
					<p className='text-sm text-muted-foreground'>Страна</p>
					<p className='text-base font-medium text-foreground'>{user.country ?? '-'}</p>
				</div>
			</div>

			<div className='grid gap-3 sm:grid-cols-2'>
				{stats.map((item) => (
					<div key={item.label} className='rounded-3xl bg-muted p-4'>
						<p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>{item.label}</p>
						<p className='text-lg font-semibold text-foreground'>{item.value}</p>
					</div>
				))}
			</div>
		</div>
	)
}
