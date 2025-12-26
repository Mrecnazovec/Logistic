const messages: Record<string, string> = {
	// page.tsx
	'history.meta.title': 'История',

	// orderStatusConfig.ts
	'history.status.delivered': 'Доставлено',
	'history.status.in_process': 'В процессе',
	'history.status.no_driver': 'Без водителя',
	'history.status.paid': 'Оплачено',
	'history.status.pending': 'В ожидании',

	// HistoryColumns.tsx
	'history.table.customer': 'Заказчик',
	'history.table.carrier': 'Перевозчик',
	'history.table.logistic': 'Логист',
	'history.table.status': 'Статус',
	'history.table.origin': 'Отправление',
	'history.table.destination': 'Назначение',
	'history.table.route': 'Маршрут (км)',
	'history.table.price': 'Стоимость',
	'history.table.documents': 'Документы',
	'history.placeholder': '-',

	// HistoryCardList.tsx
	'history.card.section.participants': 'Участники',
	'history.card.section.route': 'Маршрут',
	'history.card.section.dates': 'Даты',
	'history.card.section.price': 'Стоимость',
	'history.card.section.documents': 'Документы',
	'history.card.customer': 'Заказчик',
	'history.card.logistic': 'Логист',
	'history.card.carrier': 'Перевозчик',
	'history.card.load': 'Погрузка',
	'history.card.unload': 'Выгрузка',
	'history.card.distance': 'Дистанция',
	'history.card.loadDate': 'Дата погрузки',
	'history.card.deliveryDate': 'Дата выгрузки',
	'history.card.createdAt': 'Создано',
	'history.card.total': 'Итого',
	'history.card.pricePerKm': 'Цена за км',
	'history.card.currency': 'Валюта',
	'history.card.documentsCount': 'Кол-во документов',
	'history.card.title': 'Заявка №{id}',
	'history.card.customerMissing': 'Не указан заказчик',
	'history.card.documentsLabel': 'Документы: {count}',
	'history.card.open': 'Открыть',
}

export default messages
