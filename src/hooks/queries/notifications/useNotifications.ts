import { notificationsService } from '@/services/notifications.service'
import { getAccessToken } from '@/services/auth/auth-token.service'
import type { INotification, IPaginatedNotificationList } from '@/shared/types/Notification.interface'
import { useMutation, useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'

const parseNextPage = (response?: IPaginatedNotificationList) => {
	if (!response?.next) return undefined
	const searchParams = new URL(response.next).searchParams
	const next = searchParams.get('page')
	return next ? Number(next) : undefined
}

export const useNotifications = (enabled: boolean) => {
	const queryClient = useQueryClient()
	const hasAccessToken = Boolean(getAccessToken())
	const canQuery = enabled && hasAccessToken

	const {
		data,
		isLoading,
		isFetching,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
		refetch: refetchNotifications,
	} = useInfiniteQuery({
		queryKey: ['notifications'],
		queryFn: ({ pageParam = 1 }) => notificationsService.getNotifications(pageParam),
		initialPageParam: 1,
		getNextPageParam: (lastPage) => parseNextPage(lastPage),
		enabled: canQuery,
		staleTime: 30_000,
	})

	const { mutate: markRead } = useMutation({
		mutationKey: ['notifications', 'mark-read'],
		mutationFn: (id: number) => notificationsService.markRead(id),
		onSuccess(_, id) {
			queryClient.setQueryData(['notifications'], (current?: { pages?: IPaginatedNotificationList[] }) => {
				if (!current?.pages) return current
				return {
					...current,
					pages: current.pages.map((page) => ({
						...page,
						results: page.results.map((item) => (item.id === id ? { ...item, is_read: true } : item)),
					})),
				}
			})
			queryClient.invalidateQueries({ queryKey: ['notifications'] })
		},
	})

	const { mutate: markAllRead, isPending: isMarkingAllRead } = useMutation({
		mutationKey: ['notifications', 'mark-all-read'],
		mutationFn: () => notificationsService.markAllRead(),
		onSuccess() {
			queryClient.setQueryData(['notifications'], (current?: { pages?: IPaginatedNotificationList[] }) => {
				if (!current?.pages) return current
				return {
					...current,
					pages: current.pages.map((page) => ({
						...page,
						results: page.results.map((item) => ({ ...item, is_read: true })),
					})),
				}
			})
			queryClient.invalidateQueries({ queryKey: ['notifications'] })
		},
	})

	const notifications = useMemo(() => (data?.pages ?? []).flatMap((page) => page.results), [data?.pages])
	const firstPageNotifications = useMemo(() => data?.pages?.[0]?.results ?? [], [data?.pages])

	return useMemo(
		() => ({
			notifications,
			firstPageNotifications,
			refetchNotifications,
			isLoadingNotifications: canQuery ? isLoading || isFetching : false,
			isFetchingNextPage: canQuery ? isFetchingNextPage : false,
			hasNextPage: Boolean(canQuery && hasNextPage),
			fetchNextPage,
			markRead,
			markAllRead,
			isMarkingAllRead,
			isNotificationsEnabled: canQuery,
		}),
		[
			canQuery,
			fetchNextPage,
			hasNextPage,
			isFetching,
			isFetchingNextPage,
			isLoading,
			isMarkingAllRead,
			markAllRead,
			markRead,
			firstPageNotifications,
			notifications,
			refetchNotifications,
		]
	)
}
