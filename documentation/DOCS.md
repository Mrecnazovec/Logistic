## Hooks - ## Auth

useLogin - mutation for user login via authService.login; returns login/isLoading.
useLogout - mutation for logout with token cleanup and page refresh.
useRegister - mutation for registration via authService.register; returns register/isLoading.
useChangeRole - mutation to switch user role via authService.changeRole with toasts.
useForgotPassword - mutation to request password reset email via authService.forgotPassword.
useChangePassword - changes password via authService.changePassword.
useResendVerify - mutation to resend verification email via authService.resendVerify.
useVerifyEmail - mutation to verify email via authService.verifyEmail.
useGetDashboardStats - fetches dashboard stats via authService.getDashboardStats.

 - ## Me

useGetAnalytics - fetches profile analytics via meService.getAnalytics.
useGetMe - fetches current user profile via meService.getMe.
usePatchMe - mutation for partial profile update via meService.patchMe.
useUpdateMe - mutation for full profile update via meService.updateMe.
useSendEmailVerifyFromProfile - sends a verification email via meService.sendEmailVerifyFromProfile.
useVerifyEmailFromProfile - verifies email via meService.verifyEmailFromProfile and refreshes profile. 

- ## Notifications

useNotifications - loads notifications with pagination via notificationsService.getNotifications and exposes firstPageNotifications.
useNotificationsRealtime - subscribes to notifications WS, logs all in/out messages, and invalidates notifications queries when incoming data has event/action (including type:event messages).
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

useGetCitySuggest - fetches city suggestions by term via geoService.getCitySuggest.
useGetCountrySuggest - fetches country suggestions by term via geoService.getCountrySuggest. 

- ## Loads

useGetLoad - fetches load details by uuid via loadsService.getLoad.
useGetLoadsBoard - fetches board loads with filters via loadsService.getLoadsBoard.
useGetLoadsMine - fetches my loads with filters via loadsService.getLoadsMine.
useGetLoadsPublic - fetches public loads using URL params via loadsService.getLoadsPublic.
useCreateLoad - creates load, invalidates list, redirects to announcements.
useGenerateLoadInvite - generates invite link for load via loadsService.generateLoadInvite.
useLoadInvite - opens invite by token via loadsService.getLoadInviteByToken.
usePatchLoad - partial load update by id via loadsService.patchLoad.
usePutLoad - full load update by id via loadsService.putLoad.
useRefreshLoad - refreshes load announcement via loadsService.refreshLoad.
useToggleLoadVisibility - toggles load visibility for the current user via loadsService.toggleLoadVisibility.
useCancelLoad - cancels load with reason via loadsService.cancelLoad. 

- ## Offers

useAcceptOffer - accepts offer via offersService.acceptOffer.
useCounterOffer - sends counter-offer with price via offersService.counterOffer.
useInviteOffer - invites to offer via offersService.inviteOffer.
useRejectOffer - rejects offer via offersService.rejectOffer.
useCreateOffer - creates offer via offersService.createOffer.
useDeleteOffer - deletes offer by uuid via offersService.deleteOffer.
useGetIncomingOffers - loads incoming offers with pagination via offersService.getIncomingOffers.
useGetMyOffers - loads my offers with pagination via offersService.getMyOffers.
useGetOfferById - loads offer details by uuid via offersService.getOfferById.
useGetOffer - loads offer detail by id via offersService.getOfferById.
useGetOfferLogs - loads offer status logs by offer id via offersService.getOfferLogs.
useGetOffers - loads offers list with filters via offersService.getOffers. 

- ## Agreements

useGetAgreements - loads agreements list with optional pagination via agreementsService.getAgreements.
useGetAgreement - loads agreement detail by id via agreementsService.getAgreement.
useAcceptAgreement - accepts agreement by id via agreementsService.acceptAgreement.
useRejectAgreement - rejects agreement by id via agreementsService.rejectAgreement. 

- ## Support

useCreateSupportTicket - sends support message via supportService.createSupportTicket.
useCreateConsultation - sends a consultation request via supportService.createConsultation. 
useLoadsPublicRealtime - subscribes to loads WS events, logs all in/out messages, and invalidates public loads queries on create/update/remove actions.

- ## Orders

useCreateOrder - creates order via ordersService.createOrder.
useDeleteOrder - deletes order by id via ordersService.deleteOrder.
useGetOrder - loads order details by id via ordersService.getOrder.
useGetSharedOrder - loads public order details by share token via ordersService.getSharedOrder.
useGetSharedOrderStatusHistory - loads order status history by order id for shared views via ordersService.getOrderStatusHistory.
useGetOrderDocuments - loads order documents via ordersService.getOrderDocuments.
useGetOrderStatusHistory - loads driver status history via ordersService.getOrderStatusHistory.
useGetOrders - loads orders list with filters via ordersService.getOrders.
useGenerateOrderInvite - posts invite generation for an order via ordersService.generateOrderInvite.
useGetInvitePreview - loads order invite preview by token via ordersService.getInvitePreview.
useInviteOrderById - sends an order invite to a specific user id via ordersService.inviteOrderById.
useAcceptOrderInvite - accepts an order invite via ordersService.acceptOrderInvite.
useDeclineOrderInvite - declines an order invite via ordersService.declineOrderInvite.
useConfirmOrderTerms - confirms order terms by order id via ordersService.confirmOrderTerms.
useCancelOrder - cancels order by id via ordersService.cancelOrder.
useUpdateOrder - full order update via ordersService.updateOrder.
useUpdateOrderStatus - updates driver status via ordersService.updateOrderStatus.
useUploadOrderDocument - uploads document for order via ordersService.uploadOrderDocument.
usePatchOrder - partial order update via ordersService.patchOrder. 
useUpdateOrderGps - posts order gps update via ordersService.updateOrderGps and invalidates order queries.
useToggleOrderPrivacy - posts order privacy toggle via ordersService.toggleOrderPrivacy and invalidates order queries.
useGetOrderTracking - loads order tracking payload by id via ordersService.getOrderTracking.

- ## Payments

useConfirmPaymentCarrier - confirms payment as carrier via paymentsService.confirmPaymentCarrier.
useConfirmPaymentCustomer - confirms payment as customer via paymentsService.confirmPaymentCustomer.
useConfirmPaymentLogistic - confirms payment as logistic via paymentsService.confirmPaymentLogistic.
useGetPayment - fetches payment details by id via paymentsService.getPayment. 

- ## Ratings

useCreateRating - creates user rating via ratingsService.createRating.
useDeleteRating - deletes rating via ratingsService.deleteRating.
useGetRating - fetches rating detail by id via ratingsService.getRating.
useGetRatingUser - fetches rating user by id via ratingsService.getRatingUser.
useGetRatings - fetches ratings list via ratingsService.getRatings.
useGetRatingUser - fetches rating user by id via ratingsService.getRatingUser.
usePatchRating - partial rating update via ratingsService.patchRating.
useUpdateRating - rating update via ratingsService.updateRating. 

- ## Others

useDebounce - returns a debounced value with a delay timer.
useMediaQuery - subscribes to matchMedia for a media query string, returns boolean.
useI18n - provides access to locale and t() from I18nProvider.
useLocaleSwitcher - switches locale, updates cookie, and replaces the route.
useIsMobile - tracks viewport width and returns true when below the mobile breakpoint.
useCabinetPage - composes cabinet page state, analytics/profile data mapping, and email/phone verification actions.
useDeskMyPage - composes desk my-offers page state, tabs, unread indicators, table/card data, and decision modal state.
useEditForm - manages desk edit form state and submits patchLoad by uuid (data: CargoPublishRequestDto).
useEditPage - composes desk edit page state, load-to-form reset, and selected city labels for selectors.
useEditFormMapState - manages local map/address state for desk edit form and watches origin/destination values.
useInvitePage - composes invite page auth/invite states, formatted cargo values, and accept/counter/reject actions.
useNotificationsPage - composes notifications page state, selected notification sync, infinite loading, and read actions.
useIdProfilePage - composes profile-by-id page data, chart stats, locale formatting, and transport dialog state.
usePostForm - manages announcements posting form defaults and submits createLoad payload (data: CargoPublishRequestDto).
usePostingPage - composes posting page state (form, loading, country watchers, and email-contact availability).
useStatusPage - composes order status page data (order, status history timeline, localized formatters, and status badge metadata).
useOrderPage - composes order detail page state, handlers, role-based permissions, and action callbacks.
/i18n - translation keys and locale messages directory.
config.ts - locales list, Locale type, defaultLocale, localeCookie.
getLocale - reads locale from cookie (server) with fallback to default.
I18nProvider/useI18n - provider and hook for locale + t() with interpolation.
languages.ts - languageOptions with labels/flags for selector UI.
paths.ts - getLocaleFromPath/stripLocaleFromPath/addLocaleToPath helpers.
messages/index.ts - aggregates messages and getMessages(locale).

## Lib helpers

currencySymbols - mapping of currency codes to symbols (USD/EUR/RUB/KZT/UZS).
getCurrencySymbol - returns currency symbol or code.
formatCurrencyValue - formats number/string as currency with grouping.
formatCurrencyPerKmValue - formats currency value and appends /km.
formatDateValue - safe date formatting with pattern (default dd.MM.yyyy).
formatDateTimeValue - formats date/time with Russian locale full date and time.
formatRelativeDate - relative time formatting (min/hour/day ago).
formatPlace - joins city/country with comma or placeholder.
formatWeightValue - formats weight with thousand separators and "kg".
formatPriceValue - wrapper over formatCurrencyValue for convenience.
formatPricePerKmValue - wrapper over formatCurrencyPerKmValue.
formatDistanceKm - formats numeric distance with km.
parseDistanceKm - parses distance value to number for sorting.
parseDateToTimestamp - parses date to timestamp for sorting.
formatDurationFromMinutes - formats total minutes to "X h Y min".
formatAgeFromMinutes - human-readable age from minutes ("min/h/day ago").
handleNumericInput - normalizes numeric input (comma to dot) and applies regex.
getLocaleTag - maps app locale code to Intl locale tag for numeric/date formatting.
formatTrend - formats percent trend text with sign and locale-aware decimals.
formatCityLabel - builds city display label from city and country fields (city: City | null).
createCityFromValues - creates a City object from name/country form values (name?: string, country?: string).
clampAxlesValue - clamps axles input string to max numeric value (value: string, max?: number).
shouldDisableEmailContact - returns whether email contact options should be disabled (email?: string | null).
isValueMissing - checks whether a string-like value is empty after trimming.
parseNumber - parses number-like values and returns finite numbers or null.
getDaysSince - returns full days passed since a date string (dateValue?: string | null).
parsePieChart - parses profile pie_chart payload from object or JSON string into normalized chart fields.
formatPlural - returns locale-aware pluralized count string for ru/en forms.
InputOTP - OTP code input built on input-otp.
transliterate - transliterates between Cyrillic and Latin characters.
cn - merges className strings via clsx and tailwind-merge.
getLocale - resolves locale from path/cookie on the server.
getLocaleFromPath - extracts locale from a path if present.
addLocaleToPath - prefixes a path with locale when needed.
stripLocaleFromPath - removes locale prefix from a path.
buildSearchDefaultValues - builds ISearch object from URLSearchParams with type coercion.
buildPaginationItems - creates pagination page list with ellipsis handling for long ranges.
getPageNumberFromUrl - extracts a valid positive page number from a URL search param.
buildTimelineSections - builds grouped timeline sections from order status history with localized labels and date/time formatting.
buildPointQuery - composes geocoding query string from city/address for map routing.
resolveYandexLang - maps app locale to Yandex Maps language code.
loadYandexMaps - dynamically loads Yandex Maps JS API v2.1 script and returns initialized ymaps instance.
ensureYandexMultiRouterModule - ensures Yandex `multiRouter.MultiRoute` module is loaded before building road routes.
getFirstDocumentByCategory - returns the earliest document in a category from order documents list.

## Services

authService - auth, registration, role change, password recovery, email verification APIs.
auth-token.service - token storage in cookies (read/save/remove).
loadsService - load CRUD, invites, visibility management via /loads API.
meService - fetch/update profile and analytics.
notificationsService - load notifications and mark as read.
offersService - offer CRUD, actions (accept/reject/invite/counter), and status logs.
ordersService - order CRUD, cancel, invites, status updates, gps/privacy/tracking methods, document upload, and public order fetch by share token.
paymentsService - fetches payment by id and confirms payments for customer/carrier/logistic endpoints.
ratingsService - user ratings CRUD.
agreementsService - agreements list/detail plus accept/reject actions.
nominatimService - OpenStreetMap Nominatim lookup for city coordinates.
supportService - submits support tickets via /support endpoint.
WSClient - reusable WebSocket client with auth, subscriptions, named event listeners, reconnect, queue, and optional in/out message logging callback.

## Shared enums

CategoryEnum - categories (licenses, contracts, loading, unloading, other).
ContactPrefEnum - contact preferences (email/phone/both) plus ContactPrefSelector and getContactPrefName.
InitiatorEnum - initiator of event (CUSTOMER or CARRIER).
ModerationStatusEnum - moderation statuses pending/approved/rejected.
OrderStatusEnum - order statuses pending/in_process/delivered/no_driver/paid.
OrderDriverStatusEnum - driver statuses (stopped/en_route/problem) and selector.
PaymentMethodEnum - payment methods (cash/cashless/both) and PaymentMethodSelector.
OfferResponseStatusEnum - offer response statuses (waiting/action_required/rejected).
PriceCurrencyEnum - currencies (UZS/KZT/RUB/USD/EUR) and PriceSelector.
RoleEnum - roles (LOGISTIC/CUSTOMER/CARRIER) and RoleSelect.
StatusEnum - cargo statuses (POSTED, MATCHED, DELIVERED, COMPLETED, CANCELLED, HIDDEN).
TransportTypeEnum - transport types (TENT/CONT/REEFER/DUMP/CARTR/GRAIN/LOG/PICKUP/MEGA/OTHER) and TransportSelect/getTransportName.

## Shared types

Analytics.interface.ts - IAnalytics schema type from api.
api.ts - generated OpenAPI components/operations types for backend.
Agreement.interface.ts - agreement list/detail types and query params for agreements endpoints.
CargoList.interface.ts - ICargoList type for cargo list.
CargoPublish.interface.ts - ICargoPublish and DTOs for create/update cargo.
Error.interface.ts - IErrorResponse and FieldError for error responses.
Geo.interface.ts - City/Country types and suggest responses.
Invite.interface.ts - InviteResponseActionsProps for invite/offer actions (accept/counter/reject) using offerId payloads.
Login.interface.ts - types for login/refresh/forgot password and change password.
Logout.interface.ts - ILogoutRequest and ILogoutResponse for logout.
Me.interface.ts - profile/update/role change and email verification types.
Notification.interface.ts - INotification and IPaginatedNotificationList.
Notifications.api.ts - query/response types for notifications.
Offer.interface.ts - offer types for create/detail/invite/counter/reject responses and status logs; IOfferShort includes invite_token and invite_offer.
Order.interface.ts - order types with address fields, documents, status history, upload DTO, invite preview, invite payload fields, driver payment method type, and accept invite response.
PaginatedList.interface.ts - paginated lists for agreements, cargos, offers, offer status logs, orders, ratings.
Payment.interface.ts - payment schemas (payment and patched update) with method/status helpers.
Rating.interface.ts - rating types with enriched rating user list (nullable stats, distance, geo, orders) and rating users query params.
RatingTableRow.interface.ts - alias for rating table row type.
Registration.interface.ts - registration/verification DTOs and refresh response.
Search.interface.ts - ISearch filter params with ordering, numeric/boolean extras, and rating_min/rating_max filters.
DashboardStats.interface.ts - dashboard statistics response type for auth dashboard stats endpoint.
Nominatim.interface.ts - CityCoordinates and NominatimResult response types for Nominatim lookups.
Support.interface.ts - support ticket and consultation request DTOs.

## Shared regex

NUMERIC_REGEX - matches numbers up to 12 digits with optional 2 decimals.
PRODUCT_MAX_LENGTH - max length for product string (120).

## Components

Badge - badge component built on shadcn/ui.
getLocale - resolves locale from path/cookie on the server.
getLocaleFromPath - extracts locale from a path if present.
addLocaleToPath - prefixes a path with locale when needed.
stripLocaleFromPath - removes locale prefix from a path.
Button - shadcn button with variants.
getLocale - resolves locale from path/cookie on the server.
getLocaleFromPath - extracts locale from a path if present.
addLocaleToPath - prefixes a path with locale when needed.
stripLocaleFromPath - removes locale prefix from a path.
Calendar - date picker using react-day-picker.
I18nProvider - provides locale/messages context for translations.
Card - card container components (Card/CardHeader/CardContent/CardFooter/CardTitle).
Command - command palette component on shadcn/ui.
getLocale - resolves locale from path/cookie on the server.
getLocaleFromPath - extracts locale from a path if present.
addLocaleToPath - prefixes a path with locale when needed.
stripLocaleFromPath - removes locale prefix from a path.
Container - layout wrapper with max width.
Dialog - modal dialog built on Radix Dialog.
DropdownMenu - Radix dropdown menu.
Loader - spinner loader indicator.
Logo - app SVG logo.
Popover - Radix popover wrapper.
RadioGroup - radio button group.
ScrollArea - styled scroll container.
Select - Radix select dropdown.
Separator - horizontal/vertical divider component.
Sheet - sliding panel built on Radix Sheet.
Sidebar - responsive sidebar component with mobile sheet behavior.
Skeleton - skeleton placeholder.
SuspensePageSkeleton - reusable suspense fallback skeleton with dashboard/form/detail variants.
Tabs - Radix tabs.
Toggle - toggle button.
Tooltip - Radix tooltip.
Checkbox - Radix checkbox (file Checkbox.tsx).
NoPhoto - profile image placeholder.
BadgeSelector - badge status selector dropdown.
CitySelector - city selector with suggestions/search and optional Nominatim coordinates callback.
ContactSelector - preferred contact selector with optional email option disabling.
CountrySelector - country selector with suggestions.
CurrencySelector - currency selector based on PriceSelector.
DateSelector - single or range date selector.
Drawer - Vaul-based drawer component with trigger/overlay/content/title helpers for slide-in panels.
PaymentSelector - payment method selector.
TableTypeSelector - toggle between card/table view.
TransportSelector - transport type selector from TransportSelect.
LanguageSelect - locale switcher select component.
SearchFields - cargo search filters form with optional axles/volume fields.
SearchRatingFields - rating filters form.
SharedOrderPage - read-only shared order details view.
SharedDocsPage - read-only shared order documents list.
SharedFolderPage - read-only shared order document folder view with download links.
SharedPaymentPage - read-only shared order payment details.
SharedStatusPage - shared order status tab restriction view.
Form - React Hook Form wrapper with validation.
Input - text input field.
InputGroup - grouped inputs/buttons with shared border.
Label - field label.
Textarea - multiline text field.
RichTextEditor - Tiptap editor with toolbar.
MenuBar - toolbar for RichTextEditor.
CargoActionsDropdown - cargo actions (edit/delete etc).
DeskMyActions - quick actions for my dashboard items.
DeskOfferQuickActions - quick offer actions (accept/reject/contacts).
OrdersActionsDropdown - order actions menu.
UuidCopy - copy UUID to clipboard with tooltip.
CounterOfferModal - modal to send counter offer.
DeskInviteModal - modal with offer details and actions.
DeskOffersModal - modal with offers list for cargo/order.
ConfirmIrreversibleActionModal - reusable confirmation modal for irreversible actions (title/description/cancel/confirm).
OfferDecisionModal - modal to accept/reject offer invitation.
OfferModal - modal to create offer for cargo.
OrderRatingModal - modal to view and edit role-based order ratings with update mode.
CardPagination - hook useCardPagination and pagination controls for cards.
CardListLayout - card grid with pagination.
CardSections - renders card sections with icons.
cycleColumnSort - table column sort direction helper.
TableStates - empty/error table states.
Table - base table component with header/body/cells.
SortIcon - sort icon for tables.
DataTable - data table with pagination/sorting/page selection.
HistoryColumns - history table columns with role-aware rating display.
HistoryPage - order history page with role-aware rating summaries.
DashboardLayout - dashboard layout with navigation and content.
Header - dashboard header with search/notifications/profile.
HeaderNavConfig - nav links/roles config for header.
MobileNav - dashboard mobile menu.
NavItems - sidebar nav items list.
Sidebar - dashboard sidebar with logo and links.
MainLayout - base layout for public pages.
Header (main-layout) - public pages header.
Footer - public pages footer.
InviteDriverModal - modal to invite driver to order by id or link and allow accepting invite token.
ConsultationModal - modal with email input and actions for free consultation.
CabinetEmailModal - modal for updating email and verifying via OTP code.
PolicyAgreementModal - modal to accept policy agreement with checkbox and submit action.
PostingPage - announcements posting page composer that wires section UI blocks with form submit state.
OriginSection - presentational origin block for city/address/load date fields in posting form.
DestinationSection - presentational destination block for city/address/delivery date fields in posting form.
ShippingSection - presentational shipping block for price/volume/axles/contact/payment/visibility fields.
EquipmentSection - presentational equipment block for product/transport/weight/description fields.
PostingActions - submit and cancel dialog action block for posting form.
Cabinet - cabinet page composer that combines profile and analytics panels with contact verification modals.
ProfilePanel - presentational cabinet profile panel with identity, readonly fields, and email/phone actions.
AnalyticsPanel - presentational cabinet analytics panel with detail cards and revenue/transport dialogs.
AnalyticsDetailCard - presentational analytics card for a single cabinet KPI item with loading and trend state.
DeskMyPage - desk/my page composer that wires tabs, table/card views, and offer decision modal.
DeskMyView - presentational desk/my view with search form, tabs, and responsive card/table content.
EditPage - desk/edit page composer that wires edit form orchestration to the form UI.
EditFormContent - presentational desk edit form UI for origin/destination/shipping/equipment blocks and actions.
EditOriginSection - presentational desk edit origin block with city/address/date and optional map picker.
EditDestinationSection - presentational desk edit destination block with city/address/date and optional map picker.
EditShippingSection - presentational desk edit shipping block with currency/price/volume/axles/contact/payment/visibility fields.
EditEquipmentSection - presentational desk edit equipment block with product/transport/weight/description fields.
EditFormActions - presentational submit/cancel actions with confirm dialog for desk edit form.
InvitePage - desk invite page composer with hydration fallback and invite content suspense boundary.
InviteView - presentational invite page UI that renders auth/error/content states and response actions.
Notifications - notifications page composer that wires header/list/details panels with notifications state.
NotificationsHeader - notifications header with unread badge, refresh, and mark-all-read actions.
NotificationsListPanel - notifications list panel with tabs, infinite-scroll sentinel, and item selection.
NotificationsDetailsPanel - details panel wrapper that renders selected notification details or empty/loading state.
AgreementPageView - presentational agreement detail and accept/reject UI for order agreement route.
InvitePageView - presentational order invite preview and decision workflow UI.
SharedOrderPageView - presentational shared order overview UI with statuses and participants.
OrderPage - order page composer that renders OrderPageView from route group.
OrderPageView - presentational order detail workspace UI with actions and status transitions.
OrderPageSkeleton - skeleton layout for order detail page while data is loading.
DocsPageSkeleton - skeleton layout for order documents folders page while documents list is loading.
OrderParticipantsGrid - presentational participants grid (customer/logistic/carrier) with role-based masking.
OrderTripGrid - presentational loading/unloading/transport sections with document status display.
OrderFinanceSection - presentational finance summary section with role-dependent amounts.
OrderDriverStatusFloating - floating driver-status dropdown control for carrier role.
FolderPageView - presentational order documents folder UI with upload/list controls and role-aware access.
PaymentPageView - presentational payment summary and confirmation UI for order payments.
StatusPage - order status page composer that wires status hook, skeleton state, and status view layout.
StatusPageView - presentational order status workspace with map block, status badge, and timeline feed.
OrderRouteMap - order status map panel with Yandex map, status-based truck target routing via MultiRoute, and remaining distance overlay.
StatusPageSkeleton - skeleton layout for order status page while order/history data is loading.
EmptyTimelineState - empty state UI for order status timeline.
IdProfile - profile-by-id page composer that wires derived state to profile view UI.
IdProfileView - presentational profile-by-id layout with profile fields, analytics dialog, and stat cards.
DeskInviteModalView - presentational desk invite modal UI extracted behind a thin DeskInviteModal composer.
InviteDriverModalView - presentational invite-driver modal UI extracted behind a thin InviteDriverModal composer.
OfferDecisionModalView - presentational offer decision modal UI extracted behind a thin OfferDecisionModal composer.
OrderRatingModalView - presentational order rating modal UI extracted behind a thin OrderRatingModal composer.
DeskOffersModalView - presentational desk offers modal UI extracted behind a thin DeskOffersModal composer.

## Stores

useRoleStore - Zustand store for user role with setRole.
useTableTypeStore - Zustand store for current view mode (card/table) with setTableType.
useSearchDrawerStore - Zustand store for opening/closing the shared search drawer.
useOfferRealtimeStore - Zustand persisted store for unread offers with add/clear by offer or cargo and reset on logout.
useAgreementRealtimeStore - Zustand persisted store for agreement update flag with mark/clear and reset on logout.





