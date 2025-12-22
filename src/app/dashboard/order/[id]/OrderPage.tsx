"use client"

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

import { getOrderStatusLabel, getOrderStatusVariant } from '@/app/dashboard/history/orderStatusConfig'
import { ProfileLink } from '@/components/ui/actions/ProfileLink'
import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/DropdownMenu'
import { Skeleton } from '@/components/ui/Skeleton'
import { useGetMe } from '@/hooks/queries/me/useGetMe'
import { useGetOrder } from '@/hooks/queries/orders/useGet/useGetOrder'
import { usePatchOrder } from '@/hooks/queries/orders/usePatchOrder'
import { useUpdateOrderStatus } from '@/hooks/queries/orders/useUpdateOrderStatus'
import {
    DEFAULT_PLACEHOLDER,
    formatDateTimeValue,
    formatDateValue,
    formatDistanceKm,
    formatPricePerKmValue,
    formatPriceValue,
} from '@/lib/formatters'
import { OrderDriverStatusEnum, OrderStatusEnum } from '@/shared/enums/OrderStatus.enum'
import { RoleEnum } from '@/shared/enums/Role.enum'
import type { DriverStatus } from '@/shared/types/Order.interface'
import { useRoleStore } from '@/store/useRoleStore'
import dynamic from 'next/dynamic'

const DRIVER_STATUS_BADGE_MAP: Record<DriverStatus, { label: string; variant: 'success' | 'warning' | 'info' | 'danger' | 'secondary' }> = {
    en_route: { label: 'В пути', variant: 'info' },
    stopped: { label: 'Остановился', variant: 'warning' },
    problem: { label: 'Проблема', variant: 'danger' },
}

const DRIVER_STATUS_BADGE_ENTRIES = Object.entries(DRIVER_STATUS_BADGE_MAP) as Array<[
    DriverStatus,
    (typeof DRIVER_STATUS_BADGE_MAP)[DriverStatus],
]>

const InviteDriverModal = dynamic(() =>
    import('@/components/ui/modals/InviteDriverModal').then((mod) => mod.InviteDriverModal),
)
const OrderRatingModal = dynamic(() =>
    import('@/components/ui/modals/OrderRatingModal').then((mod) => mod.OrderRatingModal),
)

const withFallback = (value?: string | number | null, id?: number | null) => {
    if (value === null || value === undefined || value === '') return DEFAULT_PLACEHOLDER
    if (id) return <ProfileLink name={String(value)} id={id} />
    return String(value)
}

const getFirstDocumentByCategory = <T extends { category?: string | null; created_at?: string | null }>(
    documents: T[],
    category: string,
) => {
    const matches = documents.filter((document) => (document.category ?? '').toLowerCase() === category.toLowerCase())
    if (!matches.length) return null
    return (
        matches.sort(
            (a, b) => new Date(a.created_at ?? '').getTime() - new Date(b.created_at ?? '').getTime()
        )[0] ?? null
    )
}

const getDocumentAction = (status: OrderStatusEnum | null, actions: Record<string, { hasDocument: boolean; documentDate: string; href: string }>) => {
    if (!status) return actions.loading
    if (status === OrderStatusEnum.IN_PROCESS) return actions.unloading
    if (status === OrderStatusEnum.DELIVERED || status === OrderStatusEnum.PAID) return actions.other
    return actions.loading
}

export function OrderPage() {
    const { order, isLoading } = useGetOrder()
    const { patchOrder } = usePatchOrder()
    const { role } = useRoleStore()
    const { me } = useGetMe()
    const { updateDriverStatus, isLoadingUpdateStatus } = useUpdateOrderStatus()
    const searchParams = useSearchParams()

    const statusFromQuery = searchParams.get('driver_status') as DriverStatus | null
    const currentDriverStatus = order?.driver_status ?? statusFromQuery ?? null
    const driverStatusMeta = currentDriverStatus ? DRIVER_STATUS_BADGE_MAP[currentDriverStatus] : null
    const hasDriver = Boolean(order?.carrier_name)
    const canRateParticipants = order?.status === OrderStatusEnum.PAID || order?.status === OrderStatusEnum.DELIVERED
    const isCarrier = role === RoleEnum.CARRIER
    const orderId = order ? String(order.id) : ''
    const canChangeDriverStatus = Boolean(order && isCarrier)
    const orderStatus = order?.status ?? null
    const orderLogisticId = order?.roles?.logistic?.id ?? null
    const isOrderLogistic = Boolean(orderLogisticId && me?.id === orderLogisticId)
    const canInviteDriver = Boolean(order && orderStatus === OrderStatusEnum.NODRIVER && isOrderLogistic)

    const documents = order?.documents ?? []
    const firstOtherDocument = getFirstDocumentByCategory(documents, 'other')

    const hasLoadingDocument = Boolean(order?.loading_datetime)
    const hasUnloadingDocument = Boolean(order?.unloading_datetime)
    const hasOtherDocument = Boolean(firstOtherDocument)
    const firstLoadingDocumentDate = formatDateTimeValue(order?.loading_datetime, DEFAULT_PLACEHOLDER)
    const firstUnloadingDocumentDate = formatDateTimeValue(order?.unloading_datetime, DEFAULT_PLACEHOLDER)
    const firstOtherDocumentDate = formatDateTimeValue(firstOtherDocument?.created_at, DEFAULT_PLACEHOLDER)
    const docsBasePath = orderId ? `/dashboard/order/${orderId}/docs` : ''
    const currentDocumentAction = getDocumentAction(orderStatus, {
        loading: { hasDocument: hasLoadingDocument, documentDate: firstLoadingDocumentDate, href: `${docsBasePath}/loading` },
        unloading: { hasDocument: hasUnloadingDocument, documentDate: firstUnloadingDocumentDate, href: `${docsBasePath}/unloading` },
        other: { hasDocument: hasOtherDocument, documentDate: firstOtherDocumentDate, href: `${docsBasePath}/other` },
    })

    const renderDocumentAction = (
        hasDocument: boolean,
        documentDate: string,
        href: string,
        buttonLabel: string,
        allowUpload: boolean,
        isButton?: boolean,
    ) => {
        if (hasDocument && !isButton) return <span className='font-medium text-end'>{documentDate}</span>
        if (!allowUpload) return <span className='font-medium text-end text-muted-foreground'>{DEFAULT_PLACEHOLDER}</span>
        if (hasDocument && isButton) return null
        if (isButton) {
            return (
                <Button asChild variant='outline'>
                    <Link href={href}>{buttonLabel}</Link>
                </Button>
            )
        }
        return null
    }

    const loadingStatusPatchedRef = useRef(false)
    const unloadingStatusPatchedRef = useRef(false)
    const paidStatusPatchedRef = useRef(false)

    useEffect(() => {
        loadingStatusPatchedRef.current = false
        unloadingStatusPatchedRef.current = false
        paidStatusPatchedRef.current = false
    }, [orderId])

    useEffect(() => {
        if (!orderId || !hasLoadingDocument) return
        if (order?.status !== OrderStatusEnum.PENDING) return
        if (loadingStatusPatchedRef.current) return
        loadingStatusPatchedRef.current = true
        patchOrder({ id: orderId, data: { status: OrderStatusEnum.IN_PROCESS } })
    }, [hasLoadingDocument, order?.status, orderId, patchOrder])

    useEffect(() => {
        if (!orderId || !hasUnloadingDocument) return
        if (order?.status !== OrderStatusEnum.IN_PROCESS) return
        if (unloadingStatusPatchedRef.current) return
        unloadingStatusPatchedRef.current = true
        patchOrder({ id: orderId, data: { status: OrderStatusEnum.DELIVERED } })
    }, [hasUnloadingDocument, order?.status, orderId, patchOrder])

    useEffect(() => {
        if (!orderId || !hasOtherDocument) return
        if (order?.status !== OrderStatusEnum.DELIVERED) return
        if (paidStatusPatchedRef.current) return
        paidStatusPatchedRef.current = true
        patchOrder({ id: orderId, data: { status: OrderStatusEnum.PAID } })
    }, [hasOtherDocument, order?.status, orderId, patchOrder])

    const handleDriverStatusSelect = (nextStatus: OrderDriverStatusEnum) => {
        if (!orderId || nextStatus === currentDriverStatus) return
        updateDriverStatus({ id: orderId, data: { driver_status: nextStatus } })
    }

    const orderStatusBadge = orderStatus ? (
        <Badge variant={getOrderStatusVariant(orderStatus)}>{getOrderStatusLabel(orderStatus)}</Badge>
    ) : (
        <Badge variant='secondary'>Статус не задан</Badge>
    )

    if (isLoading) return <OrderPageSkeleton />
    if (!order) {
        return (
            <div className='flex h-full w-full items-center justify-center rounded-4xl bg-background p-8 text-center text-muted-foreground'>
                Данные заказа недоступны
            </div>
        )
    }

    const driverStatusButton = canChangeDriverStatus ? (
        <div className='fixed md:bottom-6 bottom-20 right-6 z-50'>
            <DropdownMenu>
                <DropdownMenuTrigger asChild disabled={isLoadingUpdateStatus}>
                    <button type='button' className='outline-none' aria-label='Изменить статус водителя' disabled={isLoadingUpdateStatus}>
                        <Badge
                            variant={driverStatusMeta?.variant ?? 'secondary'}
                            className='cursor-pointer px-4 py-2 text-sm shadow-lg data-[state=open]:ring-2 data-[state=open]:ring-ring'
                        >
                            {isLoadingUpdateStatus
                                ? 'Обновление...'
                                : driverStatusMeta
                                    ? driverStatusMeta.label
                                    : 'Выберите статус водителя'}
                        </Badge>
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                    {DRIVER_STATUS_BADGE_ENTRIES.map(([status, meta]) => (
                        <DropdownMenuItem
                            key={status}
                            onSelect={() => handleDriverStatusSelect(status)}
                            disabled={isLoadingUpdateStatus || status === currentDriverStatus}
                            className='focus:bg-transparent focus:text-foreground'
                        >
                            <Badge variant={meta.variant} className='w-full justify-center text-sm'>
                                {meta.label}
                            </Badge>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    ) : null

    return (
        <div className='space-y-6 rounded-4xl bg-background p-8'>
            <div className='flex flex-wrap items-center gap-3'>
                {orderStatusBadge}
                <UuidCopy id={order.id} isPlaceholder />
            </div>

            <div className='grid gap-15 lg:grid-cols-3'>
                {[{
                    title: 'Информация о заказчике',
                    rows: [
                        { label: 'Заказчик', value: withFallback(order.roles.customer.name, order.roles.customer.id) },
                        { label: 'Компания', value: withFallback(order.roles.customer.company) },
                        { label: 'Контакты', value: withFallback(order.roles.customer.phone) },
                    ],
                }, {
                    title: 'Информация о логисте',
                    rows: [
                        { label: 'Логист', value: withFallback(order.roles.logistic?.name, order.roles.logistic?.id) },
                        { label: 'Компания', value: withFallback(order.roles.logistic?.company) },
                        { label: 'Контакты', value: withFallback(order.roles.logistic?.phone) },
                    ],
                }, {
                    title: 'Информация о перевозчике',
                    rows: [
                        { label: 'Перевозчик', value: hasDriver ? withFallback(order.roles.carrier?.name, order.roles.carrier?.id) : DEFAULT_PLACEHOLDER },
                        { label: 'Компания', value: withFallback(order.roles.carrier?.company) },
                        { label: 'Контакты', value: withFallback(order.roles.carrier?.phone) },
                    ],
                }].map((section) => (
                    <div key={section.title} className='space-y-3'>
                        <p className='font-medium text-brand'>{section.title}</p>
                        {section.rows.map((row) => (
                            <p key={row.label} className='flex justify-between gap-3'>
                                <span className='text-grayscale'>{row.label}</span>
                                <span className='text-end font-medium'>{row.value}</span>
                            </p>
                        ))}
                    </div>
                ))}
            </div>

            <div className='h-px w-full bg-grayscale' />

            <div className='grid gap-15 lg:grid-cols-3'>
                <div className='space-y-3'>
                    <p className='font-medium text-brand'>Погрузка</p>
                    <p className='flex justify-between gap-3'>
                        <span className='text-grayscale'>Город отправления</span>
                        <span className='text-end font-medium'>{withFallback(order.origin_city)}</span>
                    </p>
                    <p className='flex justify-between gap-3'>
                        <span className='text-grayscale'>Адрес</span>
                        <span className='text-end font-medium'>{withFallback(order.origin_address)}</span>
                    </p>
                    <p className='flex justify-between gap-3'>
                        <span className='text-grayscale'>Дата погрузки</span>
                        <span className='text-end font-medium'>{formatDateValue(order.load_date)}</span>
                    </p>
                    <p className='flex justify-between gap-3'>
                        <span className='text-success-500'>Погрузился</span>
                        {renderDocumentAction(hasLoadingDocument, firstLoadingDocumentDate, `${docsBasePath}/loading`, 'Загрузить документ', isCarrier)}
                    </p>
                </div>

                <div className='space-y-3'>
                    <p className='font-medium text-brand'>Разгрузка</p>
                    <p className='flex justify-between gap-3'>
                        <span className='text-grayscale'>Город назначения</span>
                        <span className='text-end font-medium'>{withFallback(order.destination_city)}</span>
                    </p>
                    <p className='flex justify-between gap-3'>
                        <span className='text-grayscale'>Адрес</span>
                        <span className='text-end font-medium'>{withFallback(order.destination_address)}</span>
                    </p>
                    <p className='flex justify-between gap-3'>
                        <span className='text-grayscale'>Дата разгрузки</span>
                        <span className='text-end font-medium'>{formatDateValue(order.delivery_date)}</span>
                    </p>
                    <p className='flex justify-between gap-3'>
                        <span className='text-success-500'>Разгрузился</span>
                        {renderDocumentAction(hasUnloadingDocument, firstUnloadingDocumentDate, `${docsBasePath}/unloading`, 'Загрузить документ', isCarrier)}
                    </p>
                </div>

                <div className='space-y-3'>
                    <p className='font-medium text-brand'>Параметры перевозки</p>
                    <p className='flex justify-between gap-3'>
                        <span className='text-grayscale'>Расстояние</span>
                        <span className='text-end font-medium'>{formatDistanceKm(order.route_distance_km, DEFAULT_PLACEHOLDER)}</span>
                    </p>
                    <p className='flex justify-between gap-3'>
                        <span className='text-grayscale'>Стоимость</span>
                        <span className='text-end font-medium'>{formatPriceValue(order.price_total, order.currency)}</span>
                    </p>
                    {/* <p className='flex justify-between gap-3'>
                        <span className='text-success-500'>Прочие документы</span>
                        {renderDocumentAction(hasOtherDocument, firstOtherDocumentDate, `${docsBasePath}/other`, 'Загрузить файл', true)}
                    </p> */}
                    <p className='flex items-center justify-between gap-3'>
                        <span className='text-grayscale'>Статус водителя</span>
                        {order.status !== 'no_driver' && driverStatusMeta ? (
                            <Badge variant={driverStatusMeta.variant}>{driverStatusMeta.label}</Badge>
                        ) : (
                            <span className='text-end font-medium text-muted-foreground'>{DEFAULT_PLACEHOLDER}</span>
                        )}
                    </p>
                </div>
            </div>

            <div className='h-px w-full bg-grayscale' />

            <div className='grid gap-15 lg:grid-cols-3'>
                <div className='space-y-3'>
                    <p className='font-medium text-brand'>Финансы</p>
                    <p className='flex justify-between gap-3 text-error-500'>
                        <span className='text-grayscale'>Стоимость</span>
                        <span className='font-medium'>{formatPriceValue(order.price_total, order.currency)}</span>
                    </p>
                    <p className='flex justify-between gap-3 text-success-500'>
                        <span className='text-grayscale'>Цена за километр</span>
                        <span className='font-medium'>{formatPricePerKmValue(order.price_per_km, order.currency)}</span>
                    </p>
                </div>
            </div>

            <div className='flex flex-wrap items-center justify-end gap-3'>
                {role === RoleEnum.CARRIER &&
                    renderDocumentAction(currentDocumentAction.hasDocument, currentDocumentAction.documentDate, currentDocumentAction.href, 'Загрузить файл', true, true)}
                {canInviteDriver && order && <InviteDriverModal order={order} canInviteById={canInviteDriver} />}
                {canRateParticipants && order && <OrderRatingModal order={order} currentRole={role ?? null} disabled={isLoading} />}
            </div>

            {driverStatusButton}
        </div>
    )
}

function OrderPageSkeleton() {
    return (
        <div className='space-y-6 rounded-4xl bg-background p-8'>
            <div className='flex items-center gap-3'>
                <Skeleton className='h-7 w-28 rounded-full' />
                <Skeleton className='h-6 w-32 rounded-full' />
            </div>
            <div className='grid gap-15 lg:grid-cols-3'>
                {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className='space-y-3'>
                        <Skeleton className='h-5 w-2/3' />
                        {Array.from({ length: 4 }).map((__, rowIndex) => (
                            <div key={rowIndex} className='flex items-center justify-between gap-3'>
                                <Skeleton className='h-4 w-24' />
                                <Skeleton className='h-4 w-32' />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <Skeleton className='h-px w-full' />
            <div className='grid gap-15 lg:grid-cols-3'>
                {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className='space-y-3'>
                        <Skeleton className='h-5 w-2/3' />
                        {Array.from({ length: 3 }).map((__, rowIndex) => (
                            <div key={rowIndex} className='flex items-center justify-between gap-3'>
                                <Skeleton className='h-4 w-28' />
                                <Skeleton className='h-4 w-28' />
                            </div>
                        ))}
                        <Skeleton className='h-7 w-28 rounded-full' />
                    </div>
                ))}
            </div>
            <Skeleton className='h-px w-full' />
            <div className='grid gap-15 lg:grid-cols-3'>
                <div className='space-y-3'>
                    <Skeleton className='h-5 w-1/2' />
                    <Skeleton className='h-4 w-full' />
                    <Skeleton className='h-4 w-3/4' />
                </div>
            </div>
            <div className='flex flex-wrap items-center justify-end gap-3'>
                <Skeleton className='h-10 w-56 rounded-full' />
                <Skeleton className='h-10 w-44 rounded-full' />
                <Skeleton className='h-10 w-48 rounded-full' />
            </div>
        </div>
    )
}
