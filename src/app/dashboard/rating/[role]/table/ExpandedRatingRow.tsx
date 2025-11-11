'use client'

import { IRatingTableRow } from '@/shared/types/RatingTableRow.interface'
import { format } from 'date-fns'

export function ExpandedRatingRow({ user }: { user: IRatingTableRow }) {
	return (
		<div className='flex flex-col gap-4'>
			<div className='flex flex-col md:flex-row md:items-center md:justify-between'>
				<div className='w-full'>
					<p className='text-brand font-bold mb-4'>
						Рейтинг пользователя: <span className='text-black'>4.5</span> <span className='font-bold text-yellow-500'>★★★★☆</span>
					</p>
					<p className='text-brand mb-3'>
						Данные
					</p>
					<div className='flex items-center justify-between'>
						<p className='text-grayscale'>Зарегистрирован с <span className='text-black'>{format(user.created_at, 'dd.MM.yyyy')}</span></p>
						<p className='text-grayscale'>Выполнено заказов <span className='text-black'>476 заказов</span></p>
						<p className='text-grayscale'>Пройдено пути <span className='text-black'>11 234 км</span></p>
						<p className='text-grayscale'>Название транспорта <span className='text-black'>Mersedeces Benz Amg</span></p>
					</div>
				</div>
			</div>

		</div>
	)
}
