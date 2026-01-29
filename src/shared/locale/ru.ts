const messages: Record<string, string> = {
	// enums/TransportType.enum.ts
	'shared.transport.type.tent': 'Тент',
	'shared.transport.type.cont': 'Контейнер',
	'shared.transport.type.reefer': 'Рефрижератор',
	'shared.transport.type.dump': 'Самосвал',
	'shared.transport.type.cartr': 'Автовоз',
	'shared.transport.type.grain': 'Зерновоз',
	'shared.transport.type.log': 'Лесовоз',
	'shared.transport.type.pickup': 'Пикап',
	'shared.transport.type.mega': 'Мега-тент',
	'shared.transport.type.other': 'Другое',
	'shared.transport.symbol.tent': 'Т',
	'shared.transport.symbol.cont': 'К',
	'shared.transport.symbol.reefer': 'Р',
	'shared.transport.symbol.dump': 'С',
	'shared.transport.symbol.cartr': 'А',
	'shared.transport.symbol.grain': 'З',
	'shared.transport.symbol.log': 'Л',
	'shared.transport.symbol.pickup': 'П',
	'shared.transport.symbol.mega': 'М',
	'shared.transport.symbol.other': 'Др',

	// enums/Role.enum.ts
	'shared.role.logistic': 'Экспедитор',
	'shared.role.customer': 'Грузоотправитель',
	'shared.role.carrier': 'Перевозчик',

	// enums/PriceCurrency.enum.ts
	'shared.currency.uzs': 'Сум',
	'shared.currency.kzt': 'Тенге',
	'shared.currency.rub': 'Рубль',
	'shared.currency.usd': 'Доллар',
	'shared.currency.eur': 'Евро',

	// enums/PaymentMethod.enum.ts
	'shared.payment.cash': 'Наличные',
	'shared.payment.cashless': 'Безналичный расчет',
	'shared.payment.bankTransfer': 'Перечисление',
	'shared.payment.both': 'Оба',

	// enums/OrderStatus.enum.ts
	'shared.orderDriverStatus.stopped': 'Ожидает',
	'shared.orderDriverStatus.problem': 'Есть проблема',
	'shared.orderDriverStatus.enRoute': 'В пути',

	// enums/ContactPref.enum.ts
	'shared.contactPref.email': 'Email',
	'shared.contactPref.phone': 'Телефон',
	'shared.contactPref.both': 'Email и телефон',
}

export default messages
