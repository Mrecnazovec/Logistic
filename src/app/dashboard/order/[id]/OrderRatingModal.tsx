'use client'

import { useMemo, useState } from 'react'
import { Star } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/Dialog'
import { Input } from '@/components/ui/form-control/Input'
import { Textarea } from '@/components/ui/form-control/Textarea'
import { useCreateRating } from '@/hooks/queries/ratings/useCreateRating'
import { RoleEnum, RoleSelect } from '@/shared/enums/Role.enum'
import type { IOrderDetail } from '@/shared/types/Order.interface'
import type { UserRatingRequestDto } from '@/shared/types/Rating.interface'

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

export function OrderRatingModal({ order, currentRole, disabled }: OrderRatingModalProps) {
	const [open, setOpen] = useState(false)
	const [formState, setFormState] = useState<Record<number, { score: number | ''; comment: string }>>({})
	const { createRating, isLoadingCreate } = useCreateRating()

	const participants = useMemo(() => {
		const logisticId = (order as unknown as { logistic?: number | null }).logistic ?? null
		const list: Participant[] = []

		if (order.customer) {
			list.push({
				id: order.customer,
				name: order.customer_name,
				role: RoleEnum.CUSTOMER,
			})
		}
		if (order.carrier) {
			list.push({
				id: order.carrier,
				name: order.carrier_name,
				role: RoleEnum.CARRIER,
			})
		}
		if (logisticId) {
			list.push({
				id: logisticId,
				name: order.logistic_name,
				role: RoleEnum.LOGISTIC,
			})
		}

		if (!currentRole) return list
		return list.filter((participant) => participant.role !== currentRole)
	}, [currentRole, order])

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
					Оценить участников
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className='text-center text-2xl font-bold'>Оценка участников перевозки</DialogTitle>
				</DialogHeader>

				{!hasParticipants ? (
					<p className='text-center text-muted-foreground py-6'>Нет участников для оценки.</p>
				) : (
					<div className='grid gap-4 md:grid-cols-2'>
						{participants.map((participant) => {
							const entry = formState[participant.id] ?? { score: '', comment: '' }
							const scoreValue = entry.score
							const isSubmitDisabled = !scoreValue || isLoadingCreate
							return (
								<div key={participant.id} className='rounded-2xl border bg-muted/20 p-4 space-y-3'>
									<div className='flex items-center justify-between gap-2'>
										<div className='flex flex-col'>
											<p className='font-semibold text-foreground'>{participant.name}</p>
											<p className='text-xs text-muted-foreground'>Роль: {RoleSelect.find((type) => type.type === participant.role)?.name}</p>
										</div>
										<Star className='size-5 text-warning-500' aria-hidden />
									</div>
									<Input
										type='number'
										inputMode='numeric'
										min={1}
										max={5}
										step={1}
										placeholder='Оценка 1-5'
										value={scoreValue}
										onChange={(event) => handleChange(participant.id, 'score', event.target.value)}
										className='rounded-full border-none bg-white'
									/>
									<Textarea
										placeholder='Комментарий (необязательно)'
										value={entry.comment}
										onChange={(event) => handleChange(participant.id, 'comment', event.target.value)}
										className='min-h-[96px] resize-none'
									/>
									<Button
										onClick={() => handleSubmit(participant)}
										disabled={isSubmitDisabled}
										className='w-full rounded-full bg-brand text-white hover:bg-brand/90 disabled:opacity-60'
									>
										Отправить оценку
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
