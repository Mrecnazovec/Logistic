'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog'
import { Textarea } from '@/components/ui/form-control/Textarea'
import { useCreateRating } from '@/hooks/queries/ratings/useCreateRating'
import { useUpdateRating } from '@/hooks/queries/ratings/useUpdateRating'
import { RoleEnum, RoleSelect } from '@/shared/enums/Role.enum'
import type { IOrderDetail } from '@/shared/types/Order.interface'
import type { UserRatingRequestDto } from '@/shared/types/Rating.interface'
import { useGetMe } from '@/hooks/queries/me/useGetMe'
import { useI18n } from '@/i18n/I18nProvider'

type Participant = {
	id: number
	name: string
	role: RoleEnum
}

interface OrderRatingModalProps {
	order: IOrderDetail
	currentRole: RoleEnum | null
	disabled?: boolean
}

const getParticipants = (order: IOrderDetail, meId?: number) => {
	const list: Participant[] = []

	if (order.roles.customer) {
		list.push({
			id: order.roles.customer.id,
			name: order.roles.customer.name,
			role: RoleEnum.CUSTOMER,
		})
	}
	if (order.roles.carrier) {
		list.push({
			id: order.roles.carrier.id,
			name: order.roles.carrier.name,
			role: RoleEnum.CARRIER,
		})
	}
	if (order.roles.logistic) {
		list.push({
			id: order.roles.logistic.id,
			name: order.roles.logistic.name,
			role: RoleEnum.LOGISTIC,
		})
	}

	if (!meId) return list
	return list.filter((participant) => participant.id !== meId)
}

type RatedEntry = {
	customer_value?: number
	carrier_value?: number
	logistic_value?: number
	customer_rating_id?: number
	carrier_rating_id?: number
	logistic_rating_id?: number
}

type RatedMap = {
	by_customer?: RatedEntry
	by_carrier?: RatedEntry
	by_logistic?: RatedEntry
}

const getRatedMeta = (order: IOrderDetail, currentRole: RoleEnum | null, targetRole: RoleEnum) => {
	if (!currentRole) return null
	const rated = order.rated as RatedMap | null | undefined
	if (!rated) return null

	const entry =
		currentRole === RoleEnum.CUSTOMER
			? rated.by_customer
			: currentRole === RoleEnum.CARRIER
				? rated.by_carrier
				: currentRole === RoleEnum.LOGISTIC
					? rated.by_logistic
					: null

	if (!entry) return null

	if (targetRole === RoleEnum.CUSTOMER) {
		return { score: entry.customer_value ?? null, ratingId: entry.customer_rating_id ?? null }
	}
	if (targetRole === RoleEnum.CARRIER) {
		return { score: entry.carrier_value ?? null, ratingId: entry.carrier_rating_id ?? null }
	}
	if (targetRole === RoleEnum.LOGISTIC) {
		return { score: entry.logistic_value ?? null, ratingId: entry.logistic_rating_id ?? null }
	}
	return null
}

export function OrderRatingModal({ order, currentRole: _currentRole, disabled }: OrderRatingModalProps) {
	const { t } = useI18n()
	const [open, setOpen] = useState(false)
	const [formState, setFormState] = useState<Record<number, { score: number | ''; comment: string }>>({})
	const [editState, setEditState] = useState<Record<number, boolean>>({})
	const { createRating, isLoadingCreate } = useCreateRating()
	const { updateRating, isLoadingUpdate } = useUpdateRating()
	const { me } = useGetMe()

	const participants = getParticipants(order, me?.id)

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

	const handleSubmit = (participant: Participant) => {
		const entry = formState[participant.id]
		if (!entry?.score || entry.score < 1 || entry.score > 5) {
			return
		}

		const payload: UserRatingRequestDto = {
			rated_user: participant.id,
			order: order.id,
			score: entry.score,
			comment: entry.comment || undefined,
		}

		const meta = getRatedMeta(order, _currentRole, participant.role)
		if (meta?.ratingId) {
			updateRating(
				{ id: String(meta.ratingId), data: payload },
				{
					onSuccess: () =>
						setFormState((prev) => ({
							...prev,
							[participant.id]: { score: '', comment: '' },
						})),
				},
			)
			return
		}

		createRating(payload, {
			onSuccess: () =>
				setFormState((prev) => ({
					...prev,
					[participant.id]: { score: '', comment: '' },
				})),
		})
	}

	const hasParticipants = participants.length > 0

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					disabled={!hasParticipants || disabled}
					className='bg-brand text-white hover:bg-brand/90 rounded-full'
				>
					{t('components.orderRating.trigger')}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className='text-center text-2xl font-bold'>{t('components.orderRating.title')}</DialogTitle>
				</DialogHeader>

				{!hasParticipants ? (
					<p className='text-center text-muted-foreground py-6'>{t('components.orderRating.empty')}</p>
				) : (
					<div className='grid gap-4 md:grid-cols-2'>
						{participants.map((participant) => {
							const entry = formState[participant.id] ?? { score: '', comment: '' }
							const ratedMeta = getRatedMeta(order, _currentRole, participant.role)
							const existingScore = ratedMeta?.score ?? null
							const scoreValue = entry.score || existingScore || ''
							const isEditing = Boolean(editState[participant.id])
							const isLocked = Boolean(existingScore) && !isEditing
							const isSubmitDisabled =
								isLoadingCreate || isLoadingUpdate || !scoreValue || (Boolean(existingScore) && !isEditing)
							return (
								<div key={participant.id} className='rounded-2xl border bg-muted/20 p-4 space-y-3'>
									<div className='flex items-center justify-between gap-2'>
										<div className='flex flex-col'>
											<p className='font-semibold text-foreground'>{participant.name}</p>
											<p className='text-xs text-muted-foreground'>
												{t('components.orderRating.role')}: {t(RoleSelect.find((type) => type.type === participant.role)?.nameKey ?? '')}
											</p>
										</div>
										<Star className='size-5 text-warning-500 fill-warning-500' aria-hidden />
									</div>
									<div className='flex items-center gap-1'>
										{Array.from({ length: 5 }, (_, index) => {
											const ratingValue = index + 1
											const isActive = Number(scoreValue) >= ratingValue
											return (
												<button
													key={ratingValue}
													type='button'
													aria-label={t('components.orderRating.scoreLabel', { rating: ratingValue })}
													onClick={() => handleScoreSelect(participant.id, ratingValue)}
													className='rounded-full p-1 transition-colors'
													disabled={isLocked}
												>
													<Star
														className={
															isActive
																? 'size-6 text-warning-500 fill-warning-500'
																: 'size-6 text-muted-foreground fill-transparent'
														}
													/>
												</button>
											)
										})}
									</div>
									<Textarea
										placeholder={t('components.orderRating.comment')}
										value={entry.comment}
										onChange={(event) => handleChange(participant.id, 'comment', event.target.value)}
										className='min-h-[96px] resize-none'
										disabled={isLocked}
									/>
									{isLocked ? (
										<button
											type='button'
											onClick={() => setEditState((prev) => ({ ...prev, [participant.id]: true }))}
											className='text-xs text-brand hover:text-brand/80 cursor-pointer border-b border-brand'
										>
											{t('components.orderRating.edit')}
										</button>
									) : null}
									<Button
										onClick={() => handleSubmit(participant)}
										disabled={isSubmitDisabled}
										className='w-full rounded-full bg-brand text-white hover:bg-brand/90 disabled:opacity-60'
									>
										{t('components.orderRating.submit')}
									</Button>
								</div>
							)
						})}
					</div>
				)}
			</DialogContent>
		</Dialog>
	)
}
