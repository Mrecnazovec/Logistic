'use client'

import { Star } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/form-control/Textarea'
import { RoleSelect } from '@/shared/enums/Role.enum'
import type { IOrderDetail } from '@/shared/types/Order.interface'
import { getRatedMeta, type Participant } from '../lib/orderRating.utils'

type Translator = (key: string, params?: Record<string, string | number>) => string

type Props = {
	t: Translator
	order: IOrderDetail
	currentRole: import('@/shared/enums/Role.enum').RoleEnum | null
	participants: Participant[]
	formState: Record<number, { score: number | ''; comment: string }>
	editState: Record<number, boolean>
	isLoadingCreate: boolean
	isLoadingUpdate: boolean
	onScoreSelect: (id: number, score: number) => void
	onCommentChange: (id: number, comment: string) => void
	onEditEnable: (id: number) => void
	onSubmit: (participant: Participant) => void
}

export function OrderRatingParticipantsGrid({
	t,
	order,
	currentRole,
	participants,
	formState,
	editState,
	isLoadingCreate,
	isLoadingUpdate,
	onScoreSelect,
	onCommentChange,
	onEditEnable,
	onSubmit,
}: Props) {
	return (
		<div className='grid gap-4 md:grid-cols-2'>
			{participants.map((participant) => {
				const entry = formState[participant.id] ?? { score: '', comment: '' }
				const ratedMeta = getRatedMeta(order, currentRole, participant.role)
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
										onClick={() => onScoreSelect(participant.id, ratingValue)}
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
							onChange={(event) => onCommentChange(participant.id, event.target.value)}
							className='min-h-[96px] resize-none'
							disabled={isLocked}
						/>
						{isLocked ? (
							<button
								type='button'
								onClick={() => onEditEnable(participant.id)}
								className='text-xs text-brand hover:text-brand/80 cursor-pointer border-b border-brand'
							>
								{t('components.orderRating.edit')}
							</button>
						) : null}
						<Button
							onClick={() => onSubmit(participant)}
							disabled={isSubmitDisabled}
							className='w-full rounded-full bg-brand text-white hover:bg-brand/90 disabled:opacity-60'
						>
							{t('components.orderRating.submit')}
						</Button>
					</div>
				)
			})}
		</div>
	)
}

