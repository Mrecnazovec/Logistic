const messages: Record<string, string> = {
	// enums/TransportType.enum.ts
	'shared.transport.type.tent': 'Tarp',
	'shared.transport.type.cont': 'Container',
	'shared.transport.type.reefer': 'Reefer',
	'shared.transport.type.dump': 'Dump truck',
	'shared.transport.type.cartr': 'Car carrier',
	'shared.transport.type.grain': 'Grain truck',
	'shared.transport.type.log': 'Log truck',
	'shared.transport.type.pickup': 'Pickup',
	'shared.transport.type.mega': 'Mega trailer',
	'shared.transport.type.other': 'Other',
	'shared.transport.symbol.tent': 'T',
	'shared.transport.symbol.cont': 'C',
	'shared.transport.symbol.reefer': 'R',
	'shared.transport.symbol.dump': 'D',
	'shared.transport.symbol.cartr': 'A',
	'shared.transport.symbol.grain': 'G',
	'shared.transport.symbol.log': 'L',
	'shared.transport.symbol.pickup': 'P',
	'shared.transport.symbol.mega': 'M',
	'shared.transport.symbol.other': 'OT',

	// enums/Role.enum.ts
	'shared.role.logistic': 'Logistic',
	'shared.role.customer': 'Customer',
	'shared.role.carrier': 'Carrier',

	// enums/PriceCurrency.enum.ts
	'shared.currency.uzs': 'Sum',
	'shared.currency.kzt': 'Tenge',
	'shared.currency.rub': 'Ruble',
	'shared.currency.usd': 'Dollar',
	'shared.currency.eur': 'Euro',

	// enums/PaymentMethod.enum.ts
	'shared.payment.cash': 'Cash',
	'shared.payment.cashless': 'Cashless',
	'shared.payment.bankTransfer': 'Bank transfer',
	'shared.payment.both': 'Cash & cashless',

	// enums/OrderStatus.enum.ts
	'shared.orderDriverStatus.stopped': 'Waiting',
	'shared.orderDriverStatus.problem': 'Problem',
	'shared.orderDriverStatus.enRoute': 'On the way',

	// enums/ContactPref.enum.ts
	'shared.contactPref.email': 'Email',
	'shared.contactPref.phone': 'Phone',
	'shared.contactPref.both': 'Email and phone',
}

export default messages
