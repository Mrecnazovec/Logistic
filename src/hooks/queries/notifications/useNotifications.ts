import { notificationsService } from '@/services/notifications.service'
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
		enabled,
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
		},
	})

	const notifications = useMemo(() => (data?.pages ?? []).flatMap((page) => page.results), [data?.pages])

	return useMemo(
		() => ({
			notifications,
			refetchNotifications,
			isLoadingNotifications: isLoading || isFetching,
			isFetchingNextPage,
			hasNextPage: Boolean(hasNextPage),
			fetchNextPage,
			markRead,
			markAllRead,
			isMarkingAllRead,
		}),
		[
			fetchNextPage,
			hasNextPage,
			isFetching,
			isFetchingNextPage,
			isLoading,
			isMarkingAllRead,
			markAllRead,
			markRead,
			notifications,
			refetchNotifications,
		]
	)
}
