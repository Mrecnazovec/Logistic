'use client'

import { loadsService } from '@/services/loads.service'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

interface UseLoadInviteOptions {
	enabled?: boolean
}

export const useLoadInvite = (token?: string, options?: UseLoadInviteOptions) => {
	const canQuery = Boolean(token) && (options?.enabled ?? true)
	const {
		data,
		isLoading,
		isError,
		error,
		refetch: refetchInvite,
	} = useQuery({
		queryKey: ['load', 'invite', token],
		queryFn: () => loadsService.getLoadInviteByToken(token as string),
		enabled: canQuery,
		staleTime: 60_000,
	})

	return useMemo(
		() => ({
			invite: data,
			isLoadingInvite: isLoading,
			isInviteError: isError,
			inviteError: error,
			refetchInvite,
		}),
		[data, error, isError, isLoading, refetchInvite],
	)
}
