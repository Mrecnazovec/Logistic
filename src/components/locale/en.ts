const messages: Record<string, string> = {
	// layouts/main-layout/Header.tsx
	'components.main.header.login': 'Log in',

	// layouts/dashboard-layout/NavItems.ts
	'components.dashboard.nav.announcements': 'Announcements board',
	'components.dashboard.nav.desk': 'Trading',
	'components.dashboard.nav.transportation': 'My cargo',
	'components.dashboard.nav.rating': 'Rating',
	'components.dashboard.nav.history': 'History',
	'components.dashboard.nav.settings': 'Settings',

	// layouts/dashboard-layout/MobileNav.tsx
	'components.dashboard.mobileNav.closeMenu': 'Close menu',
	'components.dashboard.mobileNav.more': 'More',
	'components.dashboard.mobileNav.empty': 'No additional items.',

	// layouts/dashboard-layout/HeaderNavConfig.ts
	'components.dashboard.headerNav.order.details': 'Details',
	'components.dashboard.headerNav.order.docs': 'Documents',
	'components.dashboard.headerNav.order.statuses': 'Statuses',
	'components.dashboard.headerNav.order.payment': 'Payment',
	'components.dashboard.headerNav.announcements': 'Announcements board',
	'components.dashboard.headerNav.posting': 'Post an announcement',
	'components.dashboard.headerNav.transportation.search': 'Shipping search',
	'components.dashboard.headerNav.transportation.carrying': 'Carrying',
	'components.dashboard.headerNav.rating.logistic': 'Logistics',
	'components.dashboard.headerNav.rating.customer': 'Customers',
	'components.dashboard.headerNav.rating.carrier': 'Carriers',

	'components.dashboard.headerNav.desk.myOffers': 'My offers',
	'components.dashboard.headerNav.back.toMyCargo': 'Back to my cargo',
	'components.dashboard.headerNav.back.toAnnouncements': 'Back to announcements list',
	'components.dashboard.headerNav.back.toDocs': 'Back to documents',
	'components.dashboard.headerNav.profile': 'Profile',
	'components.dashboard.headerNav.language': 'Language',
	'components.dashboard.headerNav.support': 'Support',
	'components.dashboard.headerNav.password': 'Password',

	// layouts/dashboard-layout/Header.tsx
	'components.dashboard.header.notifications.title': 'Notifications',
	'components.dashboard.header.notifications.loading': 'Loading...',
	'components.dashboard.header.notifications.latest': 'Latest: {count}',
	'components.dashboard.header.notifications.allRead': 'All read',
	'components.dashboard.header.notifications.empty': 'No notifications',
	'components.dashboard.header.profile.noName': 'No name',
	'components.dashboard.header.profile.unknownRole': 'Unknown',
	'components.dashboard.header.profile.rating': 'rating',

	// ui/table/TableStates.tsx
	'components.table.empty.title': 'Nothing found',
	'components.table.empty.subtitle': 'We could not find matching results. Try adjusting the filters.',

	// ui/table/DataTable.tsx
	'components.table.search.placeholder': 'Search',
	'components.table.empty.data': 'No data available.',
	'components.table.pagination.shown': 'Shown: {count} items',
	'components.table.pagination.prev': 'Previous page',
	'components.table.pagination.next': 'Next page',
	'components.table.pagination.page': 'Page {page} of {total}',

	// pagination/CardPagination.tsx
	'components.cardPagination.ariaLabel': 'Pagination navigation',
	'components.cardPagination.page': 'Page {page} of {total}',
	'components.cardPagination.prev': 'Go to previous page',
	'components.cardPagination.next': 'Go to next page',

	// ui/search/SearchRatingFields.tsx
	'components.searchRating.search': 'Search',
	'components.searchRating.byId': 'Search by id',
	'components.searchRating.filters': 'Filters',
	'components.searchRating.reset': 'Reset filters',
	'components.searchRating.rating': 'Rating',
	'components.searchRating.from': 'From',
	'components.searchRating.to': 'To',

	// ui/search/SearchFields.tsx
	'components.search.search': 'Search',
	'components.search.byId': 'Search by id',
	'components.search.filters': 'Filters',
	'components.search.currency': 'Currency',
	'components.search.price': 'Price',
	'components.search.from': 'From',
	'components.search.to': 'To',
	'components.search.hasOffers': 'Offers availability',
	'components.search.hasOffers.yes': 'Has offers',
	'components.search.hasOffers.no': 'No offers',
	'components.search.weight': 'Weight',
	'components.search.resetTitle': 'Reset filters',
	'components.search.origin': 'From',
	'components.search.radius': 'Radius, km',
	'components.search.destination': 'To',
	'components.search.loadDate': 'Select load date',

	// ui/selectors/TransportSelector.tsx
	'components.select.transport.placeholder': 'Transport type',

	// ui/selectors/PaymentSelector.tsx
	'components.select.payment.placeholder': 'Payment method',

	// ui/selectors/CurrencySelector.tsx
	'components.select.currency.placeholder': 'Select currency',

	// ui/selectors/DateSelector.tsx
	'components.select.date.placeholder': 'Select date',

	// ui/selectors/CitySelector.tsx
	'components.select.city.placeholder': 'Select city',
	'components.select.city.searchPlaceholder': 'City',
	'components.select.city.loading': 'Loading...',
	'components.select.city.empty': 'Nothing found',

	// ui/selectors/CountrySelector.tsx
	'components.select.country.placeholder': 'Country',
	'components.select.country.searchPlaceholder': 'Country',
	'components.select.country.loading': 'Loading...',
	'components.select.country.empty': 'Nothing found',

	// ui/selectors/ContactSelector.tsx
	'components.select.contact.placeholder': 'Contact method',

	// ui/selectors/BadgeSelector.tsx
	'components.badge.counterparty': 'customer',
	'components.badge.token.cancelled': 'отменено',
	'components.badge.token.inviteMessage': 'Приглашение через заказ',
	'components.badge.token.waiting': 'ожидает',
	'components.badge.token.received': 'получен',
	'components.badge.token.cancelPrefix': 'отм',
	'components.badge.offer.invite.label': 'Driver required',
	'components.badge.offer.invite.note': 'Invitation is available to accept',
	'components.badge.offer.expired.label': 'Offer expired',
	'components.badge.offer.expired.note': 'Offer time expired or you accepted the invitation',
	'components.badge.offer.agreed.label': 'Agreed',
	'components.badge.offer.agreed.note': 'Order created, go to My cargo tab',
	'components.badge.offer.declined.label': 'Declined',
	'components.badge.offer.declined.note': 'Offer was declined',
	'components.badge.offer.awaiting.label': 'Response required',
	'components.badge.offer.awaiting.note': 'Offer awaits your decision',
	'components.badge.offer.waiting.label': 'Waiting for response',
	'components.badge.offer.waiting.note': 'Waiting for response from {counterparty}',
	'components.badge.status.posted': 'Published',
	'components.badge.status.inProgress': 'In progress',
	'components.badge.status.delivered': 'Delivered',
	'components.badge.status.completed': 'Response received',
	'components.badge.status.waiting': 'Waiting for response',

	// ui/modals/OrderRatingModal.tsx
	'components.orderRating.trigger': 'Rate participants',
	'components.orderRating.title': 'Participants rating',
	'components.orderRating.empty': 'No participants to rate.',
	'components.orderRating.role': 'Role',
	'components.orderRating.scoreLabel': 'Rating {rating}',
	'components.orderRating.comment': 'Comment (optional)',
	'components.orderRating.submit': 'Submit rating',

	// ui/modals/CounterOfferModal.tsx
	'components.counterOffer.title': 'Counter offer',
	'components.counterOffer.companyLabel': 'Company',
	'components.counterOffer.currentPriceLabel': 'Current offer',
	'components.counterOffer.pricePlaceholder': 'Enter amount',
	'components.counterOffer.currencyPlaceholder': 'Select currency',
	'components.counterOffer.paymentPlaceholder': 'Payment method',
	'components.counterOffer.commentPlaceholder': 'Comment (optional)',
	'components.counterOffer.submit': 'Send',
	'components.counterOffer.cancel': 'Cancel',

	// ui/modals/OfferModal.tsx
	'components.offerModal.title': 'Make an offer',
	'components.offerModal.empty': 'Select a record to send an offer.',
	'components.offerModal.transportLabel': 'Transport type',
	'components.offerModal.weightLabel': 'Weight',
	'components.offerModal.priceLabel': 'Price',
	'components.offerModal.pricePlaceholder': 'Enter amount',
	'components.offerModal.currencyPlaceholder': 'Select currency',
	'components.offerModal.submit': 'Send',
	'components.offerModal.close': 'Close',

	// ui/modals/OfferDecisionModal.tsx
	'components.offerDecision.title': 'Offer',
	'components.offerDecision.empty': 'Offer data is unavailable.',
	'components.offerDecision.unavailable': 'Actions for this offer are unavailable in the current status.',
	'components.offerDecision.transportLabel': 'Transport type',
	'components.offerDecision.weightLabel': 'Weight',
	'components.offerDecision.priceLabel': 'Price',
	'components.offerDecision.companyLabel': 'Company',
	'components.offerDecision.currentPrice': 'Current price',
	'components.offerDecision.pricePlaceholder': 'Enter amount',
	'components.offerDecision.currencyPlaceholder': 'Select currency',
	'components.offerDecision.paymentPlaceholder': 'Payment method',
	'components.offerDecision.accept': 'Accept',
	'components.offerDecision.counter': 'Counter',
	'components.offerDecision.reject': 'Reject',
	'components.offerDecision.acceptInvite': 'Accept invitation',
	'components.offerDecision.ton': 't',

	// ui/modals/DeskOffersModal/DeskOffersModal.tsx
	'components.deskOffers.title': 'Offers',
	'components.deskOffers.selectCargo': 'Select cargo to view offers.',
	'components.deskOffers.loading': 'Loading offers...',
	'components.deskOffers.empty': 'No offers yet.',
	'components.deskOffers.tabs.incoming': 'Incoming',
	'components.deskOffers.tabs.accepted': 'Accepted',
	'components.deskOffers.tabs.history': 'History',
	'components.deskOffers.emptyIncoming': 'No incoming offers.',
	'components.deskOffers.emptyAccepted': 'No accepted offers.',
	'components.deskOffers.emptyHistory': 'History is empty.',

	// ui/modals/DeskOffersModal/OfferHistoryItem.tsx
	'components.offerHistory.company': 'Company',
	'components.offerHistory.price': 'Price',
	'components.offerHistory.loading': 'Loading history...',
	'components.offerHistory.noChanges': 'No changed fields.',
	'components.offerHistory.empty': 'History is empty.',

	// ui/modals/DeskOffersModal/OfferCard.tsx
	'components.offerCard.company': 'Company',
	'components.offerCard.rating': 'Rating',
	'components.offerCard.price': 'Price',
	'components.offerCard.pricePlaceholder': 'Enter price',
	'components.offerCard.currencyPlaceholder': 'Select currency',
	'components.offerCard.paymentPlaceholder': 'Payment method',
	'components.offerCard.counter': 'Counter offer',
	'components.offerCard.reject': 'Reject',
	'components.offerCard.accept': 'Accept',
	'components.offerCard.negotiate': 'Negotiate',

	// ui/modals/DeskOffersModal/CargoInfo.tsx
	'components.cargoInfo.transport': 'Transport type',
	'components.cargoInfo.weight': 'Weight',
	'components.cargoInfo.initialPrice': 'Initial price',

	// ui/modals/DeskOffersModal/offerLog.ts
	'components.offerLog.empty': '-',
	'components.offerLog.yes': 'Yes',
	'components.offerLog.no': 'No',
	'components.offerLog.payment.cash': 'Cash',
	'components.offerLog.payment.cashless': 'Cashless',
	'components.offerLog.initiator.logistic': 'Logistic',
	'components.offerLog.initiator.customer': 'Customer',
	'components.offerLog.initiator.carrier': 'Carrier',
	'components.offerLog.change.price': 'Price',
	'components.offerLog.change.payment': 'Payment method',
	'components.offerLog.change.responseStatus': 'Response status',
	'components.offerLog.change.counterOffer': 'Counter offer',
	'components.offerLog.change.active': 'Active',
	'components.offerLog.change.acceptedByCustomer': 'Accepted by customer',
	'components.offerLog.change.acceptedByLogistic': 'Accepted by logistic',
	'components.offerLog.change.acceptedByCarrier': 'Accepted by carrier',
	'components.offerLog.change.initiator': 'Initiator',
	'components.offerLog.change.message': 'Message',
	'components.offerLog.system': 'System',
	'components.offerLog.unknownDate': 'Unknown date',

	// ui/modals/InviteDriverModal.tsx
	'components.inviteDriver.trigger': 'Invite driver',
	'components.inviteDriver.title': 'Driver invitation',
	'components.inviteDriver.invalidId': 'Enter a valid carrier ID.',
	'components.inviteDriver.generateFirst': 'Generate the link first.',
	'components.inviteDriver.copySuccess': 'Link copied.',
	'components.inviteDriver.copyError': 'Failed to copy the link.',
	'components.inviteDriver.price': 'Price',
	'components.inviteDriver.byId.title': 'Invite carrier by ID',
	'components.inviteDriver.byId.placeholder': 'Enter carrier ID',
	'components.inviteDriver.byId.loading': 'Sending...',
	'components.inviteDriver.byId.submit': 'Invite',
	'components.inviteDriver.byLink.title': 'Invite by link',
	'components.inviteDriver.byLink.description': 'Generate a link and send it to the driver so they can accept the invitation.',
	'components.inviteDriver.byLink.placeholder': 'Link will appear after generation',
	'components.inviteDriver.byLink.copy': 'Copy link',
	'components.inviteDriver.byLink.loading': 'Generating...',
	'components.inviteDriver.byLink.generate': 'Generate link',
	'components.inviteDriver.cancel': 'Cancel',

	// ui/modals/DeskInviteModal.tsx
	'components.deskInvite.title': 'Carrier invitation',
	'components.deskInvite.empty': 'Nothing selected. Choose an announcement in the table to send an invite.',
	'components.deskInvite.km': 'km',
	'components.deskInvite.transport': 'Transport type',
	'components.deskInvite.weight': 'Weight',
	'components.deskInvite.ton': 't',
	'components.deskInvite.price': 'Price',
	'components.deskInvite.company': 'Company',
	'components.deskInvite.offer': 'Offer',
	'components.deskInvite.byId.title': 'Invite carrier by ID',
	'components.deskInvite.byId.placeholder': 'Enter carrier ID',
	'components.deskInvite.byId.loading': 'Sending...',
	'components.deskInvite.byId.submit': 'Invite',
	'components.deskInvite.byLink.title': 'Invite by link',
	'components.deskInvite.byLink.description':
		'The link opens the offer page where the carrier can respond. Generate a link and send it to your partner or copy it for quick access.',
	'components.deskInvite.byLink.placeholder': 'Link will appear after generation',
	'components.deskInvite.byLink.copy': 'Copy link',
	'components.deskInvite.byLink.loading': 'Generating...',
	'components.deskInvite.byLink.generate': 'Generate link',
	'components.deskInvite.copySuccess': 'Link copied to clipboard.',
	'components.deskInvite.copyError': 'Failed to copy link.',
	'components.deskInvite.cancel': 'Cancel',
	'components.deskInvite.errors.noCargo': 'Cargo not found for inviting the carrier.',
	'components.deskInvite.errors.invalidId': 'Enter a valid carrier ID.',
	'components.deskInvite.errors.noData': 'Failed to load announcement data.',
	'components.deskInvite.errors.generateFirst': 'Generate a link to copy it.',

	// ui/modals/AnnouncementDetailModal.tsx
	'components.announcement.more': 'Details',
	'components.announcement.title': 'Announcement details',
	'components.announcement.section.company': 'Company and representative',
	'components.announcement.section.transport': 'Transport and dimensions',
	'components.announcement.section.from': 'From',
	'components.announcement.section.to': 'To',
	'components.announcement.section.payment': 'Payment',
	'components.announcement.section.description': 'Description',
	'components.announcement.label.company': 'Company',
	'components.announcement.label.contact': 'Contact person',
	'components.announcement.label.rating': 'Rating',
	'components.announcement.label.phone': 'Phone',
	'components.announcement.label.email': 'Email',
	'components.announcement.label.cargoName': 'Cargo name',
	'components.announcement.label.transport': 'Transport type',
	'components.announcement.label.axles': 'Axles',
	'components.announcement.label.volume': 'Volume (m3)',
	'components.announcement.label.cityCountry': 'City / country',
	'components.announcement.label.loadDate': 'Load date',
	'components.announcement.label.deliveryDate': 'Delivery date',
	'components.announcement.label.distance': 'Distance',
	'components.announcement.label.paymentMethod': 'Payment method',
	'components.announcement.label.price': 'Price',
	'components.announcement.km': 'km',
	'components.announcement.descriptionEmpty': 'No description provided',
	'components.announcement.makeOffer': 'Make an offer',
	'components.announcement.payment.transfer': 'Cashless transfer',
	'components.announcement.payment.cash': 'Cash',
	'components.announcement.payment.both': 'Cash / cashless transfer',

	// ui/form-control/RichEditor/RichTextEditor.tsx
	'components.richEditor.placeholder': 'Enter the announcement description...',

	// ui/form-control/RichEditor/MenuBar.tsx
	'components.richEditor.link.title': 'Add / edit link',
	'components.richEditor.link.apply': 'Apply',
	'components.richEditor.video.title': 'Insert YouTube video',
	'components.richEditor.video.insert': 'Insert video',

	// ui/actions/UuidCopy.tsx
	'components.uuidCopy.clipboardUnsupported': 'Clipboard is not supported',
	'components.uuidCopy.success': 'ID copied to clipboard',
	'components.uuidCopy.error': 'Failed to copy ID',
	'components.uuidCopy.copiedLabel': 'ID copied',
	'components.uuidCopy.copyLabel': 'Copy ID',

	// ui/actions/OrdersActionsDropdown.tsx
	'components.ordersActions.open': 'Open actions',
	'components.ordersActions.view': 'View',
	'components.ordersActions.delete': 'Delete',

	// ui/actions/CargoActionsDropdown.tsx
	'components.cargoActions.openMenu': 'Open actions menu',
	'components.cargoActions.refresh': 'Refresh',
	'components.cargoActions.refreshDetail': 'Announcement refresh',
	'components.cargoActions.edit': 'Edit',
	'components.cargoActions.show': 'Show',
	'components.cargoActions.hide': 'Hide',
	'components.cargoActions.sendOffer': 'Send offer',

	// ui/actions/DeskMyActions.tsx
	'components.deskMyActions.open': 'Open actions',
	'components.deskMyActions.edit': 'Edit',
	'components.deskMyActions.delete': 'Delete',
	'components.deskMyActions.hideLog': 'Hide',
}

export default messages
