const messages: Record<string, string> = {
	// layouts/main-layout/Header.tsx
	'components.main.header.login': 'Kirish',

	// layouts/dashboard-layout/NavItems.ts
	'components.dashboard.nav.announcements': "E'lonlar doskasi",
	'components.dashboard.nav.desk': 'Savdo',
	'components.dashboard.nav.transportation': 'Mening yuklarim',
	'components.dashboard.nav.rating': 'Reyting',
	'components.dashboard.nav.history': 'Tarix',
	'components.dashboard.nav.settings': 'Sozlamalar',

	// layouts/dashboard-layout/MobileNav.tsx
	'components.dashboard.mobileNav.closeMenu': 'Menyuni yopish',
	'components.dashboard.mobileNav.more': "Ko'proq",
	'components.dashboard.mobileNav.empty': "Qo'shimcha bandlar yo'q.",

	// layouts/dashboard-layout/HeaderNavConfig.ts
	'components.dashboard.headerNav.order.details': 'Tafsilotlar',
	'components.dashboard.headerNav.order.docs': 'Hujjatlar',
	'components.dashboard.headerNav.order.statuses': 'Statuslar',
	'components.dashboard.headerNav.order.payment': "To'lov",
	'components.dashboard.headerNav.announcements': "E'lonlar doskasi",
	'components.dashboard.headerNav.posting': "E'lon joylash",
	'components.dashboard.headerNav.transportation.orders': 'Buyurtmalar',
	'components.dashboard.headerNav.transportation.carrying': 'Tashish',
	'components.dashboard.headerNav.rating.logistic': 'Logistika',
	'components.dashboard.headerNav.rating.customer': 'Mijozlar',
	'components.dashboard.headerNav.rating.carrier': 'Tashuvchilar',
	'components.dashboard.headerNav.desk.myOffers': 'Mening takliflarim',
	'components.dashboard.headerNav.back.toMyCargo': 'Yuklarimga qaytish',
	'components.dashboard.headerNav.back.toAnnouncements': "E'lonlar ro'yxatiga qaytish",
	'components.dashboard.headerNav.back.toDocs': 'Hujjatlarga qaytish',
	'components.dashboard.headerNav.profile': 'Profil',
	'components.dashboard.headerNav.language': 'Til',
	'components.dashboard.headerNav.support': 'Yordam',
	'components.dashboard.headerNav.password': 'Parol',

	// layouts/dashboard-layout/Header.tsx
	'components.dashboard.header.notifications.title': 'Bildirishnomalar',
	'components.dashboard.header.notifications.loading': 'Yuklanmoqda...',
	'components.dashboard.header.notifications.latest': "So'nggi: {count}",
	'components.dashboard.header.notifications.allRead': "Hammasi o'qildi",
	'components.dashboard.header.notifications.empty': "Bildirishnoma yo'q",
	'components.dashboard.header.profile.noName': "Ism yo'q",
	'components.dashboard.header.profile.unknownRole': "Noma'lum",
	'components.dashboard.header.profile.rating': 'reyting',

	// ui/table/TableStates.tsx
	'components.table.empty.title': 'Hech narsa topilmadi',
	'components.table.empty.subtitle': "Mos natijalar topilmadi. Filtrlarni o'zgartirib ko'ring.",

	// ui/table/DataTable.tsx
	'components.table.search.placeholder': 'Qidirish',
	'components.table.empty.data': "Ma'lumot yo'q.",
	'components.table.pagination.shown': "Ko'rsatilgan: {count} ta",
	'components.table.pagination.prev': 'Oldingi sahifa',
	'components.table.pagination.next': 'Keyingi sahifa',
	'components.table.pagination.page': 'Sahifa {page} / {total}',

	// pagination/CardPagination.tsx
	'components.cardPagination.ariaLabel': 'Sahifalash navigatsiyasi',
	'components.cardPagination.page': 'Sahifa {page} / {total}',
	'components.cardPagination.prev': "Oldingi sahifaga o'tish",
	'components.cardPagination.next': "Keyingi sahifaga o'tish",

	// ui/search/SearchRatingFields.tsx
	'components.searchRating.search': 'Qidirish',
	'components.searchRating.byId': "Foydalanuvchi ID bo'yicha",
	'components.searchRating.filters': 'Filtrlar',
	'components.searchRating.reset': 'Filtrlarni tozalash',
	'components.searchRating.rating': 'Reyting',
	'components.searchRating.from': 'Dan',
	'components.searchRating.to': 'Gacha',

	// ui/search/SearchFields.tsx
	'components.search.search': 'Qidirish',
	'components.search.byId': "ID bo'yicha qidirish",
	'components.search.uuidPlaceholder.request': "So'rov ID bo'yicha",
	'components.search.uuidPlaceholder.offer': "Taklif ID bo'yicha",
	'components.search.uuidPlaceholder.shipment': "Yuk tashish ID bo'yicha",
	'components.search.filters': 'Filtrlar',
	'components.search.currency': 'Valyuta',
	'components.search.price': 'Narx',
	'components.search.from': 'Dan',
	'components.search.to': 'Gacha',
	'components.search.hasOffers': 'Takliflar mavjudligi',
	'components.search.hasOffers.yes': 'Takliflar bor',
	'components.search.hasOffers.no': "Takliflar yo'q",
	'components.search.weight': "Og'irlik",
	'components.search.resetTitle': 'Filtrlarni tozalash',
	'components.search.origin': 'Qayerdan',
	'components.search.radius': 'Radius, km',
	'components.search.destination': 'Qayerga',
	'components.search.loadDate': 'Yuklash sanasini tanlang',

	// ui/selectors/TransportSelector.tsx
	'components.select.transport.placeholder': 'Transport turi',

	// ui/selectors/PaymentSelector.tsx
	'components.select.payment.placeholder': "To'lov usuli",

	// ui/selectors/CurrencySelector.tsx
	'components.select.currency.placeholder': 'Valyutani tanlang',

	// ui/selectors/DateSelector.tsx
	'components.select.date.placeholder': 'Sanani tanlang',

	// ui/selectors/CitySelector.tsx
	'components.select.city.placeholder': 'Shaharni tanlang',
	'components.select.city.searchPlaceholder': 'Shahar',
	'components.select.city.loading': 'Yuklanmoqda...',
	'components.select.city.empty': 'Hech narsa topilmadi',

	// ui/selectors/CountrySelector.tsx
	'components.select.country.placeholder': 'Mamlakat',
	'components.select.country.searchPlaceholder': 'Mamlakat',
	'components.select.country.loading': 'Yuklanmoqda...',
	'components.select.country.empty': 'Hech narsa topilmadi',

	// ui/selectors/ContactSelector.tsx
	'components.select.contact.placeholder': 'Aloqa usuli',

	// ui/selectors/BadgeSelector.tsx
	'components.badge.counterparty': 'mijoz',
	'components.badge.token.cancelled': 'bekor qilindi',
	'components.badge.token.inviteMessage': 'Buyurtma orqali taklif',
	'components.badge.token.waiting': 'kutilmoqda',
	'components.badge.token.received': 'qabul qilindi',
	'components.badge.token.cancelPrefix': 'bek',
	'components.badge.offer.invite.label': 'Haydovchi kerak',
	'components.badge.offer.invite.note': 'Taklifnomani qabul qilish mumkin',
	'components.badge.offer.expired.label': 'Taklif muddati tugagan',
	'components.badge.offer.expired.note': 'Taklif muddati tugagan yoki siz taklifnomani qabul qilgansiz',
	'components.badge.offer.agreed.label': 'Kelishildi',
	'components.badge.offer.agreed.note': "Buyurtma yaratildi, Mening yuklarim bo'limiga o'ting",
	'components.badge.offer.declined.label': 'Rad etildi',
	'components.badge.offer.declined.note': 'Taklif rad etildi',
	'components.badge.offer.awaiting.label': 'Javob kerak',
	'components.badge.offer.awaiting.note': 'Taklif sizning qaroringizni kutmoqda',
	'components.badge.offer.waiting.label': 'Javob kutilmoqda',
	'components.badge.offer.waiting.note': '{counterparty} javobini kutmoqda',
	'components.badge.status.posted': "E'lon qilingan",
	'components.badge.status.inProgress': 'Jarayonda',
	'components.badge.status.delivered': 'Yetkazildi',
	'components.badge.status.completed': 'Javob olindi',
	'components.badge.status.waiting': 'Javob kutilmoqda',

	// ui/modals/OrderRatingModal.tsx
	'components.orderRating.trigger': 'Ishtirokchilarni baholang',
	'components.orderRating.title': 'Ishtirokchilar reytingi',
	'components.orderRating.empty': "Baholash uchun ishtirokchi yo'q.",
	'components.orderRating.role': 'Rol',
	'components.orderRating.scoreLabel': 'Reyting {rating}',
	'components.orderRating.comment': 'Izoh (ixtiyoriy)',
	'components.orderRating.submit': 'Baholashni yuborish',

	// ui/modals/CounterOfferModal.tsx
	'components.counterOffer.title': 'Qarshi taklif',
	'components.counterOffer.companyLabel': 'Kompaniya',
	'components.counterOffer.currentPriceLabel': 'Joriy taklif',
	'components.counterOffer.pricePlaceholder': 'Summani kiriting',
	'components.counterOffer.currencyPlaceholder': 'Valyutani tanlang',
	'components.counterOffer.paymentPlaceholder': "To'lov usuli",
	'components.counterOffer.commentPlaceholder': 'Izoh (ixtiyoriy)',
	'components.counterOffer.submit': 'Yuborish',
	'components.counterOffer.cancel': 'Bekor qilish',

	// ui/modals/OfferModal.tsx
	'components.offerModal.title': 'Taklif yuborish',
	'components.offerModal.empty': 'Yuborish uchun yozuvni tanlang.',
	'components.offerModal.transportLabel': 'Transport turi',
	'components.offerModal.weightLabel': "Og'irlik",
	'components.offerModal.priceLabel': 'Narx',
	'components.offerModal.pricePlaceholder': 'Summani kiriting',
	'components.offerModal.currencyPlaceholder': 'Valyutani tanlang',
	'components.offerModal.submit': 'Yuborish',
	'components.offerModal.close': 'Yopish',

	// ui/modals/OfferDecisionModal.tsx
	'components.offerDecision.title': 'Taklif',
	'components.offerDecision.empty': "Taklif ma'lumotlari mavjud emas.",
	'components.offerDecision.unavailable': 'Ushbu taklif uchun amal hozirgi statusda mavjud emas.',
	'components.offerDecision.transportLabel': 'Transport turi',
	'components.offerDecision.weightLabel': "Og'irlik",
	'components.offerDecision.priceLabel': 'Narx',
	'components.offerDecision.companyLabel': 'Kompaniya',
	'components.offerDecision.currentPrice': 'Joriy narx',
	'components.offerDecision.pricePlaceholder': 'Summani kiriting',
	'components.offerDecision.currencyPlaceholder': 'Valyutani tanlang',
	'components.offerDecision.paymentPlaceholder': "To'lov usuli",
	'components.offerDecision.accept': 'Qabul qilish',
	'components.offerDecision.counter': 'Qarshi taklif',
	'components.offerDecision.reject': 'Rad etish',
	'components.offerDecision.acceptInvite': 'Taklifnomani qabul qilish',
	'components.offerDecision.ton': 't',

	// ui/modals/DeskOffersModal/DeskOffersModal.tsx
	'components.deskOffers.title': 'Takliflar',
	'components.deskOffers.selectCargo': "Takliflarni ko'rish uchun yukni tanlang.",
	'components.deskOffers.loading': 'Takliflar yuklanmoqda...',
	'components.deskOffers.empty': "Hozircha takliflar yo'q.",
	'components.deskOffers.tabs.incoming': 'Kiruvchi',
	'components.deskOffers.tabs.accepted': 'Qabul qilingan',
	'components.deskOffers.tabs.history': 'Tarix',
	'components.deskOffers.emptyIncoming': "Kiruvchi takliflar yo'q.",
	'components.deskOffers.emptyAccepted': "Qabul qilingan takliflar yo'q.",
	'components.deskOffers.emptyHistory': "Tarix bo'sh.",

	// ui/modals/DeskOffersModal/OfferHistoryItem.tsx
	'components.offerHistory.company': 'Kompaniya',
	'components.offerHistory.price': 'Narx',
	'components.offerHistory.loading': 'Tarix yuklanmoqda...',
	'components.offerHistory.noChanges': "O'zgargan maydonlar yo'q.",
	'components.offerHistory.empty': "Tarix bo'sh.",

	// ui/modals/DeskOffersModal/OfferCard.tsx
	'components.offerCard.company': 'Kompaniya',
	'components.offerCard.rating': 'Reyting',
	'components.offerCard.price': 'Narx',
	'components.offerCard.pricePlaceholder': 'Narxni kiriting',
	'components.offerCard.currencyPlaceholder': 'Valyutani tanlang',
	'components.offerCard.paymentPlaceholder': "To'lov usuli",
	'components.offerCard.counter': 'Qarshi taklif',
	'components.offerCard.reject': 'Rad etish',
	'components.offerCard.accept': 'Qabul qilish',
	'components.offerCard.negotiate': 'Kelishish',

	// ui/modals/DeskOffersModal/CargoInfo.tsx
	'components.cargoInfo.transport': 'Transport turi',
	'components.cargoInfo.weight': "Og'irlik",
	'components.cargoInfo.initialPrice': "Boshlang'ich narx",

	// ui/modals/DeskOffersModal/offerLog.ts
	'components.offerLog.empty': '-',
	'components.offerLog.yes': 'Ha',
	'components.offerLog.no': "Yo'q",
	'components.offerLog.payment.cash': 'Naqd',
	'components.offerLog.payment.cashless': 'Naqd pulsiz',
	'components.offerLog.initiator.logistic': 'Logistika',
	'components.offerLog.initiator.customer': 'Mijoz',
	'components.offerLog.initiator.carrier': 'Tashuvchi',
	'components.offerLog.change.price': 'Narx',
	'components.offerLog.change.payment': "To'lov usuli",
	'components.offerLog.change.responseStatus': 'Javob statusi',
	'components.offerLog.change.counterOffer': 'Qarshi taklif',
	'components.offerLog.change.active': 'Faol',
	'components.offerLog.change.acceptedByCustomer': 'Mijoz qabul qildi',
	'components.offerLog.change.acceptedByLogistic': 'Logistika qabul qildi',
	'components.offerLog.change.acceptedByCarrier': 'Tashuvchi qabul qildi',
	'components.offerLog.change.initiator': 'Boshlovchi',
	'components.offerLog.change.message': 'Xabar',
	'components.offerLog.system': 'Tizim',
	'components.offerLog.unknownDate': "Noma'lum sana",

	// ui/modals/InviteDriverModal.tsx
	'components.inviteDriver.trigger': 'Haydovchini taklif qilish',
	'components.inviteDriver.title': 'Haydovchi taklifi',
	'components.inviteDriver.invalidId': 'Yaroqli tashuvchi ID kiriting.',
	'components.inviteDriver.generateFirst': 'Avval havolani yarating.',
	'components.inviteDriver.copySuccess': 'Havola nusxalandi.',
	'components.inviteDriver.copyError': "Havolani nusxalab bo'lmadi.",
	'components.inviteDriver.price': 'Narx',
	'components.inviteDriver.byId.title': 'Tashuvchini ID orqali taklif qilish',
	'components.inviteDriver.byId.placeholder': 'Tashuvchi ID kiriting',
	'components.inviteDriver.byId.loading': 'Yuborilmoqda...',
	'components.inviteDriver.byId.submit': 'Taklif qilish',
	'components.inviteDriver.byLink.title': 'Havola orqali taklif qilish',
	'components.inviteDriver.byLink.description': 'Havolani yarating va haydovchiga yuboring, shunda u taklifni qabul qiladi.',
	'components.inviteDriver.byLink.placeholder': "Havola yaratilgandan so'ng paydo bo'ladi",
	'components.inviteDriver.byLink.copy': 'Havolani nusxalash',
	'components.inviteDriver.byLink.loading': 'Yaratilmoqda...',
	'components.inviteDriver.byLink.generate': 'Havola yaratish',
	'components.inviteDriver.cancel': 'Bekor qilish',

	// ui/modals/DeskInviteModal.tsx
	'components.deskInvite.title': 'Tashuvchi taklifi',
	'components.deskInvite.empty': "Hech narsa tanlanmagan. Jadvaldan e'lonni tanlab, taklif yuboring.",
	'components.deskInvite.km': 'km',
	'components.deskInvite.transport': 'Transport turi',
	'components.deskInvite.weight': "Og'irlik",
	'components.deskInvite.ton': 't',
	'components.deskInvite.price': 'Narx',
	'components.deskInvite.company': 'Kompaniya',
	'components.deskInvite.offer': 'Taklif',
	'components.deskInvite.byId.title': 'Tashuvchini ID orqali taklif qilish',
	'components.deskInvite.byId.placeholder': 'Tashuvchi ID kiriting',
	'components.deskInvite.byId.loading': 'Yuborilmoqda...',
	'components.deskInvite.byId.submit': 'Taklif qilish',
	'components.deskInvite.byLink.title': 'Havola orqali taklif qilish',
	'components.deskInvite.byLink.description':
		'Havola taklif sahifasini ochadi, tashuvchi javob bera oladi. Havolani yarating va hamkoringizga yuboring yoki tezkor kirish uchun nusxalab oling.',
	'components.deskInvite.byLink.placeholder': "Havola yaratilgandan so'ng paydo bo'ladi",
	'components.deskInvite.byLink.copy': 'Havolani nusxalash',
	'components.deskInvite.byLink.loading': 'Yaratilmoqda...',
	'components.deskInvite.byLink.generate': 'Havola yaratish',
	'components.deskInvite.copySuccess': 'Havola buferga nusxalandi.',
	'components.deskInvite.copyError': "Havolani nusxalab bo'lmadi.",
	'components.deskInvite.cancel': 'Bekor qilish',
	'components.deskInvite.errors.noCargo': 'Tashuvchini taklif qilish uchun yuk topilmadi.',
	'components.deskInvite.errors.invalidId': 'Yaroqli tashuvchi ID kiriting.',
	'components.deskInvite.errors.noData': "E'lon ma'lumotlarini yuklab bo'lmadi.",
	'components.deskInvite.errors.generateFirst': 'Nusxalash uchun havolani yarating.',

	// ui/modals/AnnouncementDetailModal.tsx
	'components.announcement.more': 'Batafsil',
	'components.announcement.title': "E'lon tafsilotlari",
	'components.announcement.section.company': 'Kompaniya va vakil',
	'components.announcement.section.transport': "Transport va o'lchamlar",
	'components.announcement.section.from': 'Qayerdan',
	'components.announcement.section.to': 'Qayerga',
	'components.announcement.section.payment': "To'lov",
	'components.announcement.section.description': 'Tavsif',
	'components.announcement.label.company': 'Kompaniya',
	'components.announcement.label.contact': 'Aloqa shaxs',
	'components.announcement.label.rating': 'Reyting',
	'components.announcement.label.phone': 'Telefon',
	'components.announcement.label.email': 'Email',
	'components.announcement.label.cargoName': 'Yuk nomi',
	'components.announcement.label.transport': 'Transport turi',
	'components.announcement.label.axles': "O'qlar",
	'components.announcement.label.volume': 'Hajm (m3)',
	'components.announcement.label.cityCountry': 'Shahar / mamlakat',
	'components.announcement.label.loadDate': 'Yuklash sanasi',
	'components.announcement.label.deliveryDate': 'Yetkazish sanasi',
	'components.announcement.label.distance': 'Masofa',
	'components.announcement.label.paymentMethod': "To'lov usuli",
	'components.announcement.label.price': 'Narx',
	'components.announcement.km': 'km',
	'components.announcement.descriptionEmpty': "Tavsif yo'q",
	'components.announcement.makeOffer': 'Taklif yuborish',
	'components.announcement.payment.transfer': "Naqd pulsiz o'tkazma",
	'components.announcement.payment.cash': 'Naqd',
	'components.announcement.payment.both': "Naqd / naqd pulsiz o'tkazma",

	// ui/form-control/RichEditor/RichTextEditor.tsx
	'components.richEditor.placeholder': "E'lon tavsifini kiriting...",

	// ui/form-control/RichEditor/MenuBar.tsx
	'components.richEditor.link.title': "Havola qo'shish / tahrirlash",
	'components.richEditor.link.apply': "Qo'llash",
	'components.richEditor.video.title': "YouTube videosini qo'shish",
	'components.richEditor.video.insert': "Video qo'shish",

	// ui/actions/UuidCopy.tsx
	'components.uuidCopy.clipboardUnsupported': "Bufer qo'llab-quvvatlanmaydi",
	'components.uuidCopy.success': 'ID buferga nusxalandi',
	'components.uuidCopy.error': 'ID nusxalanmadi',
	'components.uuidCopy.copiedLabel': 'ID nusxalandi',
	'components.uuidCopy.copyLabel': 'ID nusxalash',

	// ui/actions/OrdersActionsDropdown.tsx
	'components.ordersActions.open': 'Amallarni ochish',
	'components.ordersActions.view': "Ko'rish",
	'components.ordersActions.delete': "O'chirish",

	// ui/actions/CargoActionsDropdown.tsx
	'components.cargoActions.openMenu': 'Amallar menyusini ochish',
	'components.cargoActions.refresh': 'Yangilash',
	'components.cargoActions.refreshDetail': "E'lonni yangilash",
	'components.cargoActions.edit': 'Tahrirlash',
	'components.cargoActions.show': "Ko'rsatish",
	'components.cargoActions.hide': 'Yashirish',
	'components.cargoActions.sendOffer': 'Taklif yuborish',

	// ui/actions/DeskMyActions.tsx
	'components.deskMyActions.open': 'Amallarni ochish',
	'components.deskMyActions.edit': 'Tahrirlash',
	'components.deskMyActions.delete': "O'chirish",
	'components.deskMyActions.hideLog': 'Yashirish',
}

export default messages
