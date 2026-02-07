'use client'

import { useNotifications } from '@/hooks/queries/notifications/useNotifications'
import { useNotificationsRealtime } from '@/hooks/queries/notifications/useNotificationsRealtime'
import { useI18n } from '@/i18n/I18nProvider'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { IMPORTANT_NOTIFICATION_TYPES, NotificationsTab } from '../constants/notificationFilters'

export function useNotificationsPage() {
	const {
		notifications,
		refetchNotifications,
		isLoadingNotifications,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
		markRead,
		markAllRead,
		isMarkingAllRead,
		isNotificationsEnabled,
	} = useNotifications(true)
	useNotificationsRealtime(isNotificationsEnabled)

	const { t } = useI18n()
	const searchParams = useSearchParams()
	const pathname = usePathname()
	const router = useRouter()
	const listRef = useRef<HTMLDivElement | null>(null)
	const sentinelRef = useRef<HTMLDivElement | null>(null)
	const [notificationsTab, setNotificationsTab] = useState<NotificationsTab>('all')

	const selectedId = useMemo(() => {
		const param = searchParams.get('id')
		if (param) return Number(param)
		return notifications[0]?.id ?? null
	}, [notifications, searchParams])

	useEffect(() => {
		if (selectedId === null || !pathname) return
		const currentParam = searchParams.get('id')
		if (!currentParam) router.replace(`${pathname}?id=${selectedId}`)
	}, [pathname, router, searchParams, selectedId])

	useEffect(() => {
		if (selectedId === null || !isNotificationsEnabled) return
		const match = notifications.find((item) => item.id === selectedId)
		if (match) {
			if (!match.is_read) markRead(match.id)
			return
		}
		if (hasNextPage && !isFetchingNextPage) fetchNextPage()
		else if (!hasNextPage && !isLoadingNotifications && !isFetchingNextPage) refetchNotifications()
	}, [
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoadingNotifications,
		isNotificationsEnabled,
		markRead,
		notifications,
		refetchNotifications,
		selectedId,
	])

	useEffect(() => {
		const root = listRef.current
		const sentinel = sentinelRef.current
		if (!root || !sentinel) return

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting) && hasNextPage && !isFetchingNextPage) fetchNextPage()
			},
			{ root, rootMargin: '0px', threshold: 1 },
		)

		observer.observe(sentinel)
		return () => observer.disconnect()
	}, [fetchNextPage, hasNextPage, isFetchingNextPage])

	const selectedNotification = useMemo(() => notifications.find((item) => item.id === selectedId), [notifications, selectedId])
	const unreadCount = useMemo(() => notifications.filter((item) => !item.is_read).length, [notifications])
	const importantNotifications = useMemo(
		() => notifications.filter((item) => IMPORTANT_NOTIFICATION_TYPES.has(item.type)),
		[notifications],
	)
	const activeNotifications = notificationsTab === 'all' ? notifications : importantNotifications
	const isListLoading = isLoadingNotifications || !isNotificationsEnabled

	const handleSelect = (id: number, isRead?: boolean) => {
		router.push(`${pathname}?id=${id}`)
		if (!isRead) markRead(id)
	}

	return {
		t,
		notifications,
		refetchNotifications,
		isFetchingNextPage,
		markAllRead,
		isMarkingAllRead,
		listRef,
		sentinelRef,
		notificationsTab,
		setNotificationsTab,
		selectedId,
		selectedNotification,
		unreadCount,
		importantNotifications,
		activeNotifications,
		isListLoading,
		handleSelect,
	}
}
