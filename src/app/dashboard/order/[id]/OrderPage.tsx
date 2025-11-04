'use client'

import { UuidCopy } from "@/components/ui/actions/UuidCopy"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { AddDriver } from "@/components/ui/modals/AddDriver"
import { useGetOrder } from "@/hooks/queries/orders/useGet/useGetOrder"
import { useState } from "react"

export function OrderPage() {
	const { order, isLoading } = useGetOrder()
	const [isDriver, setIsDriver] = useState<boolean>(true)
	return <div className="w-full h-full rounded-4xl bg-background p-8 space-y-6">
		<div className="flex items-center gap-3">
			<Badge variant={'warning'}>В пути</Badge>
			<UuidCopy uuid="123" isPlaceholder />
		</div>
		<div className="grid lg:grid-cols-3 gap-15">
			<div className='space-y-3'>
				<p className='font-medium text-brand'>Информация о заказчике</p>
				<p className='flex justify-between gap-3'><span className='text-grayscale'>Заказчик</span> <span className='font-medium text-end'>ООО “Atheletics Groups”</span></p>
				<p className='flex justify-between gap-3'><span className='text-grayscale'>Логин</span> <span className='font-medium text-end'>acme123</span></p>
				<p className='flex justify-between gap-3'><span className='text-grayscale'>Контакты</span> <span className='font-medium text-end'>+998 90 123 45 67</span></p>
				<p className='flex justify-between gap-3'><span className='text-grayscale'>Зарегистрирован с</span> <span className='font-medium text-end'>11 сентября 2023 года</span></p>
			</div>
			<div className='space-y-3'>
				<p className='font-medium text-brand'>Информация о посреднике</p>
				<p className='flex justify-between gap-3'><span className='text-grayscale'>Посредник</span> <span className='font-medium text-end'>ООО “Atheletics Groups”</span></p>
				<p className='flex justify-between gap-3'><span className='text-grayscale'>Логин</span> <span className='font-medium text-end'>acme123</span></p>
				<p className='flex justify-between gap-3'><span className='text-grayscale'>Контакты</span> <span className='font-medium text-end'>+998 90 123 45 67</span></p>
				<p className='flex justify-between gap-3'><span className='text-grayscale'>Выполнено заказов</span> <span className='font-medium text-end'>237 заказов</span></p>
				<p className='flex justify-between gap-3'><span
					className='text-grayscale'>Зарегистрирован с</span> <span className='font-medium text-end'>11 сентября 2023 года</span></p>
			</div>
			{isDriver ? <div className='space-y-3'>
				<p className='font-medium text-brand'>Информация о водителе</p>
				<p className='flex justify-between gap-3'><span className='text-grayscale'>Посредник</span> <span className='font-medium text-end'>ООО “Atheletics Groups”</span></p>
				<p className='flex justify-between gap-3'><span className='text-grayscale'>Логин</span> <span className='font-medium text-end'>acme123</span></p>
				<p className='flex justify-between gap-3'><span className='text-grayscale'>Контакты</span> <span className='font-medium text-end'>+998 90 123 45 67</span></p>
				<p className='flex justify-between gap-3'><span className='text-grayscale'>Транспорт</span> <span className='font-medium text-end'>Mercedes Benz (Контейнер)</span></p>
				<p className='flex justify-between gap-3'><span
					className='text-grayscale'>Зарегистрирован с</span> <span className='font-medium text-end'>11 сентября 2023 года</span></p>
			</div> : <div className='space-y-3'>
				<p className='font-medium text-brand'>Информация о водителе</p>
				<p className='flex justify-between gap-3'><span className='text-grayscale'>Посредник</span> <span className='font-medium text-end'>-</span></p>
				<p className='flex justify-between gap-3'><span className='text-grayscale'>Логин</span> <span className='font-medium text-end'>-</span></p>
				<p className='flex justify-between gap-3'><span className='text-grayscale'>Контакты</span> <span className='font-medium text-end'>-</span></p>
				<p className='flex justify-between gap-3'><span className='text-grayscale'>Транспорт</span> <span className='font-medium text-end'>-</span></p>
				<p className='flex justify-between gap-3'><span
					className='text-grayscale'>Зарегистрирован с</span> <span className='font-medium text-end'>-</span></p>
			</div>}
		</div>
		<div className="w-full h-[1px] bg-grayscale"></div>
		{isDriver && <div className="grid lg:grid-cols-3 gap-15">
			<div className='space-y-3'>
				<p className='font-medium text-brand'>Погрузка</p>
				<p className='flex justify-between gap-3'><span className='text-grayscale'>Город</span> <span className='font-medium text-end'>Ташкент, Узбекистан</span></p>
				<p className='flex justify-between gap-3'><span className='text-grayscale'>Улица</span> <span className='font-medium text-end'> ул. Навои, 10</span></p>
				<p className='flex justify-between gap-3'><span className='text-grayscale'>Дата</span> <span className='font-medium text-end'>02/03/2025</span></p>
				<p className='flex justify-between gap-3'><span className='text-success-500'>Загрузился</span> <span className='font-medium text-end'>02/03/2025, 14:59</span></p>
			</div>
			<div className='space-y-3'>
				<p className='font-medium text-brand'>Разгрузка</p>
				<p className='flex justify-between gap-3'><span className='text-grayscale'>Город</span> <span className='font-medium text-end'>Москва, Россия</span></p>
				<p className='flex justify-between gap-3'><span className='text-grayscale'>Улица</span> <span className='font-medium text-end'> ул. Рябинского, 10</span></p>
				<p className='flex justify-between gap-3'><span className='text-grayscale'>Дата</span> <span className='font-medium text-end'>10/03/2025</span></p>
				<p className='flex justify-between gap-3'><span className='text-success-500'>Разгрузился</span> <span className='font-medium text-end'>02/03/2025, 14:59</span></p>

			</div>
			<div className='space-y-3'>
				<p className='font-medium text-brand'>Детали поездки</p>
				<p className='flex justify-between gap-3'><span className='text-grayscale'>Общий путь</span> <span className='font-medium text-end'>2 800 км</span></p>
				<p className='flex justify-between gap-3'><span className='text-grayscale'>Цена поездки</span> <span className='font-medium text-end'>2 800 км</span></p>
				<Badge variant={'danger'}>Остановился</Badge>
			</div>
		</div>}
		{isDriver && <div className="w-full h-[1px] bg-grayscale"></div>}
		<div className="grid lg:grid-cols-3 gap-15">
			<div className='space-y-3'>
				<p className='font-medium text-brand'>Финансы</p>
				<p className='flex justify-between gap-3 text-error-500'><span className='text-grayscale'>Водитель</span> <span className='font-medium'>4 500 USD</span></p>
				<p className='flex justify-between gap-3 text-success-500'><span className='text-grayscale'>Водитель</span> <span className='font-medium'> 57 500 000 UZS</span></p>
			</div>
		</div>
		<div className="flex items-center justify-end gap-3">
			{isDriver ? <Button className="bg-black/90 hover:bg-black">Скрыть контакт Заказчика</Button> : <AddDriver />}
			<Button className="bg-warning-500/90 hover:bg-warning-500">Поделится</Button>
			<Button className="bg-error-500/90 hover:bg-error-500">Отмена перевозки</Button>
		</div>
	</div>
}
