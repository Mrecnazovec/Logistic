## Hooks

- ## Auth

useLogin вЂ” mutation for user login via authService.login; returns login/isLoading.
useLogout вЂ” mutation for logout with token cleanup and page refresh.
useRegister вЂ” mutation for registration via authService.register; returns register/isLoading.
useChangeRole вЂ” mutation to switch user role via authService.changeRole with toasts.
useForgotPassword вЂ” mutation to request password reset email via authService.forgotPassword.
useResendVerify вЂ” mutation to resend verification email via authService.resendVerify.
useResetPassword вЂ” mutation to set a new password via authService.resetPassword.
useVerifyEmail вЂ” mutation to verify email via authService.verifyEmail.

- ## Me

useGetAnalytics вЂ” fetches profile analytics via meService.getAnalytics.
useGetMe вЂ” fetches current user profile via meService.getMe.
usePatchMe вЂ” mutation for partial profile update via meService.patchMe.
useUpdateMe вЂ” mutation for full profile update via meService.updateMe.

- ## Notifications

useNotifications вЂ” loads notifications with pagination via notificationsService.getNotifications and exposes firstPageNotifications.
getNotificationDetailsText - returns details text for a notification using message or localized templates.
getNotificationTypeLabel - returns a localized label for a notification type.
getNotificationOrderId - extracts order_id from notification payload for routing.
getNotificationOfferId - returns offer_id for offer-related notifications.
getNotificationRatedById - extracts rated_by from notification payload.
getNotificationRatedUserId - extracts rated_user from notification payload.
getNotificationCargoId - extracts cargo_id from notification payload or top-level field.
getNotificationStatusChange - returns localized status change labels from payload.
getNotificationDetailsModel - builds localized notification details text, instruction, status change, and action links.
NotificationDetails - renders notification detail view with text, instruction, status change, and actions.

- ## Geo

useGetCitySuggest вЂ” fetches city suggestions by term via geoService.getCitySuggest.
useGetCountrySuggest вЂ” fetches country suggestions by term via geoService.getCountrySuggest.

- ## Loads

useGetLoad вЂ” fetches load details by uuid via loadsService.getLoad.
useGetLoadsBoard вЂ” fetches board loads with filters via loadsService.getLoadsBoard.
useGetLoadsMine вЂ” fetches my loads with filters via loadsService.getLoadsMine.
useGetLoadsPublic вЂ” fetches public loads using URL params via loadsService.getLoadsPublic.
useCreateLoad вЂ” creates load, invalidates list, redirects to announcements.
useGenerateLoadInvite вЂ” generates invite link for load via loadsService.generateLoadInvite.
useLoadInvite вЂ” opens invite by token via loadsService.getLoadInviteByToken.
usePatchLoad вЂ” partial load update by id via loadsService.patchLoad.
usePutLoad вЂ” full load update by id via loadsService.putLoad.
useRefreshLoad вЂ” refreshes load announcement via loadsService.refreshLoad.
useToggleLoadVisibility вЂ” toggles load visibility for the current user via loadsService.toggleLoadVisibility.
useCancelLoad вЂ” cancels load with reason via loadsService.cancelLoad.

- ## Offers

useAcceptOffer вЂ” accepts offer via offersService.acceptOffer.
useCounterOffer вЂ” sends counter-offer with price via offersService.counterOffer.
useInviteOffer вЂ” invites to offer via offersService.inviteOffer.
useRejectOffer вЂ” rejects offer via offersService.rejectOffer.
useCreateOffer вЂ” creates offer via offersService.createOffer.
useDeleteOffer вЂ” deletes offer by uuid via offersService.deleteOffer.
useGetIncomingOffers вЂ” loads incoming offers with pagination via offersService.getIncomingOffers.
useGetMyOffers вЂ” loads my offers with pagination via offersService.getMyOffers.
useGetOfferById вЂ” loads offer details by uuid via offersService.getOfferById.
useGetOffer - loads offer detail by id via offersService.getOfferById.
useGetOfferLogs - loads offer status logs by offer id via offersService.getOfferLogs.
useGetOffers вЂ” loads offers list with filters via offersService.getOffers.

- ## Agreements

useGetAgreements - loads agreements list with optional pagination via agreementsService.getAgreements.
useGetAgreement - loads agreement detail by id via agreementsService.getAgreement.
useAcceptAgreement - accepts agreement by id via agreementsService.acceptAgreement.
useRejectAgreement - rejects agreement by id via agreementsService.rejectAgreement.

- ## Support

useCreateSupportTicket - sends support message via supportService.createSupportTicket.

- ## Orders

useCreateOrder вЂ” creates order via ordersService.createOrder.
useDeleteOrder вЂ” deletes order by id via ordersService.deleteOrder.
useGetOrder - loads order details by id via ordersService.getOrder.
useGetOrderDocuments - loads order documents via ordersService.getOrderDocuments.
useGetOrderStatusHistory - loads driver status history via ordersService.getOrderStatusHistory.
useGetOrders - loads orders list with filters via ordersService.getOrders.
useGenerateOrderInvite - posts invite generation for an order via ordersService.generateOrderInvite.
useInviteOrderById - sends an order invite to a specific user id via ordersService.inviteOrderById.
useAcceptOrderInvite - accepts an order invite via ordersService.acceptOrderInvite.
useConfirmOrderTerms - confirms accepted order terms via ordersService.confirmOrderTerms.
useUpdateOrder - full order update via ordersService.updateOrder.
useUpdateOrderStatus - updates driver status via ordersService.updateOrderStatus.
useUploadOrderDocument - uploads document for order via ordersService.uploadOrderDocument.
usePatchOrder - partial order update via ordersService.patchOrder.

- ## Payments

useConfirmPaymentCarrier - confirms payment as carrier via paymentsService.confirmPaymentCarrier.
useConfirmPaymentCustomer - confirms payment as customer via paymentsService.confirmPaymentCustomer.
useConfirmPaymentLogistic - confirms payment as logistic via paymentsService.confirmPaymentLogistic.
useGetPayment - fetches payment details by id via paymentsService.getPayment.

- ## Ratings

useCreateRating вЂ” creates user rating via ratingsService.createRating.
useDeleteRating вЂ” deletes rating via ratingsService.deleteRating.
useGetRating вЂ” fetches rating detail by id via ratingsService.getRating.
useGetRatingUser - fetches rating user by id via ratingsService.getRatingUser.
useGetRatings вЂ” fetches ratings list via ratingsService.getRatings.
useGetRatingUser - fetches rating user by id via ratingsService.getRatingUser.
usePatchRating вЂ” partial rating update via ratingsService.patchRating.
useUpdateRating вЂ” rating update via ratingsService.updateRating.

- ## Others

useDebounce вЂ” returns a debounced value with a delay timer.
useMediaQuery вЂ” subscribes to matchMedia for a media query string, returns boolean.
useI18n - provides access to locale and t() from I18nProvider.
useLocaleSwitcher - switches locale, updates cookie, and replaces the route.
/i18n - translation keys and locale messages directory.
config.ts - locales list, Locale type, defaultLocale, localeCookie.
getLocale - reads locale from cookie (server) with fallback to default.
I18nProvider/useI18n - provider and hook for locale + t() with interpolation.
languages.ts - languageOptions with labels/flags for selector UI.
paths.ts - getLocaleFromPath/stripLocaleFromPath/addLocaleToPath helpers.
messages/index.ts - aggregates messages and getMessages(locale).

## Lib helpers

currencySymbols вЂ” mapping of currency codes to symbols (USD/EUR/RUB/KZT/UZS).
getCurrencySymbol вЂ” returns currency symbol or code.
formatCurrencyValue вЂ” formats number/string as currency with grouping.
formatCurrencyPerKmValue вЂ” formats currency value and appends вЂњ/РєРјвЂќ.
formatDateValue вЂ” safe date formatting with pattern (default dd.MM.yyyy).
formatDateTimeValue вЂ” formats date/time with Russian locale full date and time.
formatRelativeDate вЂ” relative time formatting (min/hour/day ago).
formatPlace вЂ” joins city/country with comma or placeholder.
formatWeightValue вЂ” formats weight with thousand separators and вЂњРєРівЂќ.
formatPriceValue вЂ” wrapper over formatCurrencyValue for convenience.
formatPricePerKmValue вЂ” wrapper over formatCurrencyPerKmValue.
formatDistanceKm вЂ” formats numeric distance with вЂњРєРјвЂќ.
parseDistanceKm вЂ” parses distance value to number for sorting.
parseDateToTimestamp вЂ” parses date to timestamp for sorting.
formatDurationFromMinutes вЂ“ formats total minutes to вЂњX С‡ Y РјРёРЅвЂќ.
formatAgeFromMinutes вЂ“ human-readable age from minutes (вЂњРјРёРЅ/С‡/РґРЅ РЅР°Р·Р°РґвЂќ).
handleNumericInput вЂ“ normalizes numeric input (comma to dot) and applies regex.
InputOTP - OTP code input built on input-otp.
transliterate вЂ“ transliterates between Cyrillic and Latin characters.
cn вЂ“ merges className strings via clsx and tailwind-merge.
getLocale - resolves locale from path/cookie on the server.
getLocaleFromPath - extracts locale from a path if present.
addLocaleToPath - prefixes a path with locale when needed.
stripLocaleFromPath - removes locale prefix from a path.
buildSearchDefaultValues вЂ“ builds ISearch object from URLSearchParams with type coercion.
buildPaginationItems вЂ“ creates pagination page list with ellipsis handling for long ranges.
getPageNumberFromUrl вЂ“ extracts a valid positive page number from a URL search param.

## Services

authService вЂ” auth, registration, role change, password recovery, email verification APIs.
auth-token.service вЂ” token storage in cookies (read/save/remove).
loadsService - load CRUD, invites, visibility management via /loads API.
meService - fetch/update profile and analytics.
notificationsService - load notifications and mark as read.
offersService - offer CRUD, actions (accept/reject/invite/counter), and status logs.
ordersService - order CRUD, invites, status updates, document upload.
paymentsService - fetches payment by id and confirms payments for customer/carrier/logistic endpoints.
ratingsService - user ratings CRUD.
agreementsService - agreements list/detail plus accept/reject actions.
nominatimService - OpenStreetMap Nominatim lookup for city coordinates.
supportService - submits support tickets via /support endpoint.

## Shared enums

CategoryEnum вЂ” categories (licenses, contracts, loading, unloading, other).
ContactPrefEnum вЂ” contact preferences (email/phone/both) plus ContactPrefSelector and getContactPrefName.
InitiatorEnum вЂ” initiator of event (CUSTOMER or CARRIER).
ModerationStatusEnum вЂ” moderation statuses pending/approved/rejected.
OrderStatusEnum - order statuses pending/in_process/delivered/no_driver/paid.
OrderDriverStatusEnum - driver statuses (stopped/en_route/problem) and selector.
PaymentMethodEnum - payment methods (cash/cashless/both) and PaymentMethodSelector.
OfferResponseStatusEnum - offer response statuses (waiting/action_required/rejected).
PriceCurrencyEnum - currencies (UZS/KZT/RUB/USD/EUR) and PriceSelector.
RoleEnum - roles (LOGISTIC/CUSTOMER/CARRIER) and RoleSelect.
StatusEnum - cargo statuses (POSTED, MATCHED, DELIVERED, COMPLETED, CANCELLED, HIDDEN).
TransportTypeEnum - transport types (TENT/CONT/REEFER/DUMP/CARTR/GRAIN/LOG/PICKUP/MEGA/OTHER) and TransportSelect/getTransportName.

## Shared types

Analytics.interface.ts вЂ” IAnalytics schema type from api.
api.ts вЂ” generated OpenAPI components/operations types for backend.
Agreement.interface.ts - agreement list/detail types and query params for agreements endpoints.
CargoList.interface.ts вЂ” ICargoList type for cargo list.
CargoPublish.interface.ts вЂ” ICargoPublish and DTOs for create/update cargo.
Error.interface.ts вЂ” IErrorResponse and FieldError for error responses.
Geo.interface.ts вЂ” City/Country types and suggest responses.
Invite.interface.ts вЂ” InviteResponseActionsProps for invite/offer actions (accept/counter/reject) using offerId payloads.
Login.interface.ts вЂ” types for login/tokens/forgot password/reset password.
Logout.interface.ts вЂ” ILogoutRequest and ILogoutResponse for logout.
Me.interface.ts вЂ” profile/update/role change types.
Notification.interface.ts вЂ” INotification and IPaginatedNotificationList.
Notifications.api.ts - query/response types for notifications.
Offer.interface.ts - offer types for create/detail/invite/counter/reject responses and status logs; IOfferShort includes invite_token and invite_offer.
Order.interface.ts - order types with address fields, documents, status history, and upload DTO.
PaginatedList.interface.ts - paginated lists for agreements, cargos, offers, offer status logs, orders, ratings.
Payment.interface.ts - payment schemas (payment and patched update) with method/status helpers.
Rating.interface.ts - rating types with enriched rating user list (nullable stats, distance, geo, orders) and rating users query params.
RatingTableRow.interface.ts - alias for rating table row type.
Registration.interface.ts - registration/verification DTOs and refresh response.
Search.interface.ts - ISearch filter params with ordering, numeric/boolean extras, and rating_min/rating_max filters.
Nominatim.interface.ts - CityCoordinates and NominatimResult response types for Nominatim lookups.
Support.interface.ts - support ticket create request DTO.

## Shared regex

NUMERIC_REGEX вЂ” matches numbers up to 12 digits with optional 2 decimals.
PRODUCT_MAX_LENGTH вЂ” max length for product string (120).

## Components

Badge вЂ” badge component built on shadcn/ui.
getLocale - resolves locale from path/cookie on the server.
getLocaleFromPath - extracts locale from a path if present.
addLocaleToPath - prefixes a path with locale when needed.
stripLocaleFromPath - removes locale prefix from a path.
Button вЂ” shadcn button with variants.
getLocale - resolves locale from path/cookie on the server.
getLocaleFromPath - extracts locale from a path if present.
addLocaleToPath - prefixes a path with locale when needed.
stripLocaleFromPath - removes locale prefix from a path.
Calendar вЂ” date picker using react-day-picker.
I18nProvider - provides locale/messages context for translations.
Card вЂ” card container components (Card/CardHeader/CardContent/CardFooter/CardTitle).
Command вЂ” command palette component on shadcn/ui.
getLocale - resolves locale from path/cookie on the server.
getLocaleFromPath - extracts locale from a path if present.
addLocaleToPath - prefixes a path with locale when needed.
stripLocaleFromPath - removes locale prefix from a path.
Container вЂ” layout wrapper with max width.
Dialog вЂ” modal dialog built on Radix Dialog.
DropdownMenu вЂ” Radix dropdown menu.
Loader вЂ” spinner loader indicator.
Logo вЂ” app SVG logo.
Popover вЂ” Radix popover wrapper.
RadioGroup вЂ” radio button group.
ScrollArea вЂ” styled scroll container.
Select вЂ” Radix select dropdown.
Skeleton вЂ” skeleton placeholder.
Tabs вЂ” Radix tabs.
Toggle вЂ” toggle button.
Tooltip вЂ” Radix tooltip.
Checkbox вЂ” Radix checkbox (file РЎheckbox.tsx).
NoPhoto вЂ” profile image placeholder.
BadgeSelector вЂ” badge status selector dropdown.
CitySelector вЂ” city selector with suggestions/search and optional Nominatim coordinates callback.
ContactSelector - preferred contact selector with optional email option disabling.
CountrySelector вЂ” country selector with suggestions.
CurrencySelector вЂ” currency selector based on PriceSelector.
DateSelector вЂ” single or range date selector.
Drawer вЂ” Vaul-based drawer component with trigger/overlay/content/title helpers for slide-in panels.
PaymentSelector вЂ” payment method selector.
TableTypeSelector вЂ” toggle between card/table view.
TransportSelector вЂ” transport type selector from TransportSelect.
LanguageSelect - locale switcher select component.
SearchFields - cargo search filters form with optional axles/volume fields.
SearchRatingFields вЂ” rating filters form.
Form вЂ” React Hook Form wrapper with validation.
Input вЂ” text input field.
InputGroup вЂ” grouped inputs/buttons with shared border.
Label вЂ” field label.
Textarea вЂ” multiline text field.
RichTextEditor вЂ” Tiptap editor with toolbar.
MenuBar вЂ” toolbar for RichTextEditor.
CargoActionsDropdown вЂ” cargo actions (edit/delete etc).
DeskMyActions вЂ” quick actions for my dashboard items.
DeskOfferQuickActions вЂ” quick offer actions (accept/reject/contacts).
OrdersActionsDropdown вЂ” order actions menu.
UuidCopy вЂ” copy UUID to clipboard with tooltip.
CounterOfferModal вЂ” modal to send counter offer.
DeskInviteModal вЂ” modal with offer details and actions.
DeskOffersModal вЂ” modal with offers list for cargo/order.
OfferDecisionModal вЂ” modal to accept/reject offer invitation.
OfferModal вЂ“ modal to create offer for cargo.
CardPagination вЂ“ hook useCardPagination and pagination controls for cards.
CardListLayout вЂ“ card grid with pagination.
CardSections вЂ“ renders card sections with icons.
cycleColumnSort вЂ“ table column sort direction helper.
TableStates вЂ“ empty/error table states.
Table вЂ“ base table component with header/body/cells.
SortIcon вЂ“ sort icon for tables.
DataTable вЂ“ data table with pagination/sorting/page selection.
DashboardLayout вЂ“ dashboard layout with navigation and content.
Header вЂ“ dashboard header with search/notifications/profile.
HeaderNavConfig вЂ“ nav links/roles config for header.
MobileNav вЂ“ dashboard mobile menu.
NavItems вЂ“ sidebar nav items list.
Sidebar вЂ“ dashboard sidebar with logo and links.
MainLayout вЂ“ base layout for public pages.
Header (main-layout) вЂ“ public pages header.
Footer вЂ“ public pages footer.
InviteDriverModal вЂ“ modal to invite driver to order by id or link and allow accepting invite token.

## Stores

useRoleStore вЂ” Zustand store for user role with setRole.
useTableTypeStore вЂ” Zustand store for current view mode (card/table) with setTableType.
useSearchDrawerStore вЂ” Zustand store for opening/closing the shared search drawer.


