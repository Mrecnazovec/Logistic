'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { useGetMe } from '@/hooks/queries/me/useGetMe'
import { useCreateRating } from '@/hooks/queries/ratings/useCreateRating'
import { useUpdateRating } from '@/hooks/queries/ratings/useUpdateRating'
import type { IOrderDetail } from '@/shared/types/Order.interface'
import { RoleEnum } from '@/shared/enums/Role.enum'
import type { UserRatingRequestDto } from '@/shared/types/Rating.interface'
import { getParticipants, getRatedMeta, type Participant } from '../lib/orderRating.utils'

type EntryState = { score: number | ''; comment: string }

export function useOrderRatingModalState(order: IOrderDetail, currentRole: RoleEnum | null) {
	const queryClient = useQueryClient()
	const [open, setOpen] = useState(false)
	const [formState, setFormState] = useState<Record<number, EntryState>>({})
	const [editState, setEditState] = useState<Record<number, boolean>>({})
	const { createRating, isLoadingCreate } = useCreateRating()
	const { updateRating, isLoadingUpdate } = useUpdateRating()
	const { me } = useGetMe()

	const participants = getParticipants(order, me?.id)
	const hasParticipants = participants.length > 0

	const handleChange = (id: number, field: 'score' | 'comment', value: string) => {
		setFormState((prev) => {
			const current = prev[id] ?? { score: '', comment: '' }

			if (field === 'score') {
				if (!value.trim()) {
					return { ...prev, [id]: { ...current, score: '' } }
				}

				const numeric = Number(value)
				if (!Number.isInteger(numeric) || numeric < 1 || numeric > 5) {
					return prev
				}

				return { ...prev, [id]: { ...current, score: numeric } }
			}

			return { ...prev, [id]: { ...current, comment: value } }
		})
	}

	const handleScoreSelect = (id: number, score: number) => {
		handleChange(id, 'score', String(score))
	}

	const resetParticipantState = (participantId: number) => {
		setFormState((prev) => ({
			...prev,
			[participantId]: { score: '', comment: '' },
		}))
		setEditState((prev) => ({ ...prev, [participantId]: false }))
		queryClient.invalidateQueries({ queryKey: ['get order', String(order.id)] })
	}

	const handleSubmit = (participant: Participant) => {
		const entry = formState[participant.id]
		if (!entry?.score || entry.score < 1 || entry.score > 5) return

		const payload: UserRatingRequestDto = {
			rated_user: participant.id,
			order: order.id,
			score: entry.score,
			comment: entry.comment || undefined,
		}

		const meta = getRatedMeta(order, currentRole, participant.role)
		if (meta?.ratingId) {
			updateRating(
				{ id: String(meta.ratingId), data: payload },
				{
					onSuccess: () => resetParticipantState(participant.id),
				},
			)
			return
		}

		createRating(payload, {
			onSuccess: () => resetParticipantState(participant.id),
		})
	}

	return {
		open,
		setOpen,
		formState,
		editState,
		setEditState,
		participants,
		hasParticipants,
		isLoadingCreate,
		isLoadingUpdate,
		handleChange,
		handleScoreSelect,
		handleSubmit,
	}
}

