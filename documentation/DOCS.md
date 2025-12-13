## Hooks

- ## Auth

useLogin — mutation for user login via authService.login; returns login/isLoading.
useLogout — mutation for logout with token cleanup and page refresh.
useRegister — mutation for registration via authService.register; returns register/isLoading.
useChangeRole — mutation to switch user role via authService.changeRole with toasts.
useForgotPassword — mutation to request password reset email via authService.forgotPassword.
useResendVerify — mutation to resend verification email via authService.resendVerify.
useResetPassword — mutation to set a new password via authService.resetPassword.
useVerifyEmail — mutation to verify email via authService.verifyEmail.

- ## Me

useGetAnalytics — fetches profile analytics via meService.getAnalytics.
useGetMe — fetches current user profile via meService.getMe.
usePatchMe — mutation for partial profile update via meService.patchMe.
useUpdateMe — mutation for full profile update via meService.updateMe.

- ## Notifications

useNotifications — loads notifications with pagination via notificationsService.getNotifications.

- ## Geo

useGetCitySuggest — fetches city suggestions by term via geoService.getCitySuggest.
useGetCountrySuggest — fetches country suggestions by term via geoService.getCountrySuggest.

- ## Loads

useGetLoad — fetches load details by uuid via loadsService.getLoad.
useGetLoadsBoard — fetches board loads with filters via loadsService.getLoadsBoard.
useGetLoadsMine — fetches my loads with filters via loadsService.getLoadsMine.
useGetLoadsPublic — fetches public loads using URL params via loadsService.getLoadsPublic.
useCreateLoad — creates load, invalidates list, redirects to announcements.
useGenerateLoadInvite — generates invite link for load via loadsService.generateLoadInvite.
useLoadInvite — opens invite by token via loadsService.getLoadInviteByToken.
usePatchLoad — partial load update by id via loadsService.patchLoad.
usePutLoad — full load update by id via loadsService.putLoad.
useRefreshLoad — refreshes load announcement via loadsService.refreshLoad.
useToggleLoadVisibility — toggles load visibility for the current user via loadsService.toggleLoadVisibility.
useCancelLoad — cancels load with reason via loadsService.cancelLoad.

- ## Offers

useAcceptOffer — accepts offer via offersService.acceptOffer.
useCounterOffer — sends counter-offer with price via offersService.counterOffer.
useInviteOffer — invites to offer via offersService.inviteOffer.
useRejectOffer — rejects offer via offersService.rejectOffer.
useCreateOffer — creates offer via offersService.createOffer.
useDeleteOffer — deletes offer by uuid via offersService.deleteOffer.
useGetIncomingOffers — loads incoming offers with pagination via offersService.getIncomingOffers.
useGetMyOffers — loads my offers with pagination via offersService.getMyOffers.
useGetOfferById — loads offer details by uuid via offersService.getOfferById.
useGetOffers — loads offers list with filters via offersService.getOffers.

- ## Agreements

useGetAgreements — loads agreements list with optional pagination via agreementsService.getAgreements.
useGetAgreement — loads agreement detail by id via agreementsService.getAgreement.
useAcceptAgreement — accepts agreement by id via agreementsService.acceptAgreement.
useRejectAgreement — rejects agreement by id via agreementsService.rejectAgreement.

- ## Orders

useCreateOrder — creates order via ordersService.createOrder.
useDeleteOrder — deletes order by id via ordersService.deleteOrder.
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
useCreatePayment - creates payment via paymentsService.createPayment.

- ## Ratings

useCreateRating — creates user rating via ratingsService.createRating.
useDeleteRating — deletes rating via ratingsService.deleteRating.
useGetRating — fetches rating detail by id via ratingsService.getRating.
useGetRatings — fetches ratings list via ratingsService.getRatings.
usePatchRating — partial rating update via ratingsService.patchRating.
useUpdateRating — rating update via ratingsService.updateRating.

- ## Others

useDebounce — returns a debounced value with a delay timer.
useMediaQuery — subscribes to matchMedia for a media query string, returns boolean.

## Lib helpers

currencySymbols — mapping of currency codes to symbols (USD/EUR/RUB/KZT/UZS).
getCurrencySymbol — returns currency symbol or code.
formatCurrencyValue — formats number/string as currency with grouping.
formatCurrencyPerKmValue — formats currency value and appends “/км”.
formatDateValue — safe date formatting with pattern (default dd.MM.yyyy).
formatDateTimeValue — formats date/time with Russian locale full date and time.
formatRelativeDate — relative time formatting (min/hour/day ago).
formatPlace — joins city/country with comma or placeholder.
formatWeightValue — formats weight with thousand separators and “кг”.
formatPriceValue — wrapper over formatCurrencyValue for convenience.
formatPricePerKmValue — wrapper over formatCurrencyPerKmValue.
formatDistanceKm — formats numeric distance with “км”.
parseDistanceKm — parses distance value to number for sorting.
parseDateToTimestamp — parses date to timestamp for sorting.
formatDurationFromMinutes – formats total minutes to “X ч Y мин”.
formatAgeFromMinutes – human-readable age from minutes (“мин/ч/дн назад”).
handleNumericInput – normalizes numeric input (comma to dot) and applies regex.
transliterate – transliterates between Cyrillic and Latin characters.
cn – merges className strings via clsx and tailwind-merge.
buildSearchDefaultValues – builds ISearch object from URLSearchParams with type coercion.
buildPaginationItems – creates pagination page list with ellipsis handling for long ranges.
getPageNumberFromUrl – extracts a valid positive page number from a URL search param.

## Services

authService — auth, registration, role change, password recovery, email verification APIs.
auth-token.service — token storage in cookies (read/save/remove).
loadsService — load CRUD, invites, visibility management via /loads API.
meService — fetch/update profile and analytics.
notificationsService — load notifications and mark as read.
offersService - offer CRUD and actions (accept/reject/invite/counter).
ordersService - order CRUD, invites, status updates, document upload.
paymentsService - payment creation and confirmations for customer/carrier endpoints.
ratingsService - user ratings CRUD.
agreementsService - agreements list/detail plus accept/reject actions.

## Shared enums

CategoryEnum — categories (licenses, contracts, loading, unloading, other).
ContactPrefEnum — contact preferences (email/phone/both) plus ContactPrefSelector and getContactPrefName.
InitiatorEnum — initiator of event (CUSTOMER or CARRIER).
ModerationStatusEnum — moderation statuses pending/approved/rejected.
OrderStatusEnum — order statuses pending/in_process/delivered/no_driver/paid.
OrderDriverStatusEnum — driver statuses (stopped/en_route/problem) and selector.
PaymentMethodEnum — payment methods (transfer/cash/both) and PaymentMethodSelector.
PriceCurrencyEnum — currencies (UZS/KZT/RUB/USD/EUR) and PriceSelector.
RoleEnum - roles (LOGISTIC/CUSTOMER/CARRIER) and RoleSelect.
StatusEnum - cargo statuses (POSTED, MATCHED, DELIVERED, COMPLETED, CANCELLED, HIDDEN).
TransportTypeEnum - transport types (TENT/CONT/REEFER/DUMP/CARTR/GRAIN/LOG/PICKUP/MEGA/OTHER) and TransportSelect/getTransportName.

## Shared types

Analytics.interface.ts — IAnalytics schema type from api.
api.ts — generated OpenAPI components/operations types for backend.
Agreement.interface.ts - agreement list/detail types and query params for agreements endpoints.
CargoList.interface.ts — ICargoList type for cargo list.
CargoPublish.interface.ts — ICargoPublish and DTOs for create/update cargo.
Error.interface.ts — IErrorResponse and FieldError for error responses.
Geo.interface.ts — City/Country types and suggest responses.
Invite.interface.ts — InviteResponseActionsProps for invite/offer actions (accept/counter/reject) using offerId payloads.
Login.interface.ts — types for login/tokens/forgot password/reset password.
Logout.interface.ts — ILogoutRequest and ILogoutResponse for logout.
Me.interface.ts — profile/update/role change types.
Notification.interface.ts — INotification and IPaginatedNotificationList.
Notifications.api.ts - query/response types for notifications.
Offer.interface.ts - offer types for create/detail/invite/counter/reject responses; IOfferShort includes invite_token and invite_offer.
Order.interface.ts - order types with address fields, documents, status history, and upload DTO.
PaginatedList.interface.ts - paginated lists for agreements, cargos, offers, orders, ratings.
Payment.interface.ts - payment schemas (payment, create request, patched update) with method/status helpers.
Rating.interface.ts - rating types with enriched rating user list (nullable stats, distance, geo, orders) and rating users query params.
RatingTableRow.interface.ts - alias for rating table row type.
Registration.interface.ts - registration/verification DTOs and refresh response.
Search.interface.ts - ISearch filter params with ordering, numeric/boolean extras, and rating_min/rating_max filters.

## Shared regex

NUMERIC_REGEX — matches numbers up to 12 digits with optional 2 decimals.
PRODUCT_MAX_LENGTH — max length for product string (120).

## Components

Badge — badge component built on shadcn/ui.
Button — shadcn button with variants.
Calendar — date picker using react-day-picker.
Card — card container components (Card/CardHeader/CardContent/CardFooter/CardTitle).
Command — command palette component on shadcn/ui.
Container — layout wrapper with max width.
Dialog — modal dialog built on Radix Dialog.
DropdownMenu — Radix dropdown menu.
Loader — spinner loader indicator.
Logo — app SVG logo.
Popover — Radix popover wrapper.
RadioGroup — radio button group.
ScrollArea — styled scroll container.
Select — Radix select dropdown.
Skeleton — skeleton placeholder.
Tabs — Radix tabs.
Toggle — toggle button.
Tooltip — Radix tooltip.
Checkbox — Radix checkbox (file Сheckbox.tsx).
NoPhoto — profile image placeholder.
BadgeSelector — badge status selector dropdown.
CitySelector — city selector with suggestions/search.
ContactSelector — preferred contact selector.
CountrySelector — country selector with suggestions.
CurrencySelector — currency selector based on PriceSelector.
DateSelector — single or range date selector.
Drawer — Vaul-based drawer component with trigger/overlay/content/title helpers for slide-in panels.
PaymentSelector — payment method selector.
TableTypeSelector — toggle between card/table view.
TransportSelector — transport type selector from TransportSelect.
SearchFields — cargo search filters form.
SearchRatingFields — rating filters form.
Form — React Hook Form wrapper with validation.
Input — text input field.
InputGroup — grouped inputs/buttons with shared border.
Label — field label.
Textarea — multiline text field.
RichTextEditor — Tiptap editor with toolbar.
MenuBar — toolbar for RichTextEditor.
CargoActionsDropdown — cargo actions (edit/delete etc).
DeskMyActions — quick actions for my dashboard items.
DeskOfferQuickActions — quick offer actions (accept/reject/contacts).
OrdersActionsDropdown — order actions menu.
UuidCopy — copy UUID to clipboard with tooltip.
AddDriver — modal to add driver to order.
CounterOfferModal — modal to send counter offer.
DeskOfferModal — modal with offer details and actions.
DeskOffersModal — modal with offers list for cargo/order.
OfferDecisionModal — modal to accept/reject offer invitation.
OfferModal – modal to create offer for cargo.
CardPagination – hook useCardPagination and pagination controls for cards.
CardListLayout – card grid with pagination.
CardSections – renders card sections with icons.
cycleColumnSort – table column sort direction helper.
TableStates – empty/error table states.
Table – base table component with header/body/cells.
SortIcon – sort icon for tables.
DataTable – data table with pagination/sorting/page selection.
DashboardLayout – dashboard layout with navigation and content.
Header – dashboard header with search/notifications/profile.
HeaderNavConfig – nav links/roles config for header.
MobileNav – dashboard mobile menu.
NavItems – sidebar nav items list.
Sidebar – dashboard sidebar with logo and links.
MainLayout – base layout for public pages.
Header (main-layout) – public pages header.
Footer – public pages footer.
InviteDriverModal – modal to invite driver to order by id or link and allow accepting invite token.

## Stores

useRoleStore — Zustand store for user role with setRole.
useTableTypeStore — Zustand store for current view mode (card/table) with setTableType.
useSearchDrawerStore — Zustand store for opening/closing the shared search drawer.
