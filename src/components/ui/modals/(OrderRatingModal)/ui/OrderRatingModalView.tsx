'use client'

import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog'
import { RoleEnum } from '@/shared/enums/Role.enum'
import type { IOrderDetail } from '@/shared/types/Order.interface'
import { useI18n } from '@/i18n/I18nProvider'
import { useOrderRatingModalState } from '../hooks/useOrderRatingModalState'
import { OrderRatingParticipantsGrid } from './OrderRatingParticipantsGrid'

interface OrderRatingModalProps {
	order: IOrderDetail
	currentRole: RoleEnum | null
	disabled?: boolean
}

export function OrderRatingModalView({ order, currentRole: _currentRole, disabled }: OrderRatingModalProps) {
	const { t } = useI18n()
	const {
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
	} = useOrderRatingModalState(order, _currentRole)

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
					<OrderRatingParticipantsGrid
						t={t}
						order={order}
						currentRole={_currentRole}
						participants={participants}
						formState={formState}
						editState={editState}
						isLoadingCreate={isLoadingCreate}
						isLoadingUpdate={isLoadingUpdate}
						onScoreSelect={handleScoreSelect}
						onCommentChange={(id, comment) => handleChange(id, 'comment', comment)}
						onEditEnable={(id) => setEditState((prev) => ({ ...prev, [id]: true }))}
						onSubmit={handleSubmit}
					/>
				)}
			</DialogContent>
		</Dialog>
	)
}
