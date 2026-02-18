'use client'

import { Button } from '@/components/ui/Button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/Dialog'
import { useI18n } from '@/i18n/I18nProvider'
import { useRouter } from 'next/navigation'

export function EditFormActions() {
	const { t } = useI18n()
	const router = useRouter()

	return (
		<div className='mt-4 flex items-center sm:justify-end justify-center gap-4'>
			<Dialog>
				<DialogTrigger asChild>
					<Button variant='outline'>{t('desk.edit.actions.cancel')}</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogTitle>{t('desk.edit.cancel.title')}</DialogTitle>
					<DialogDescription>{t('desk.edit.cancel.description')}</DialogDescription>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant='outline'>{t('desk.edit.cancel.close')}</Button>
						</DialogClose>
						<DialogClose asChild>
							<Button onClick={() => router.back()}>{t('desk.edit.cancel.back')}</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			<Button type='submit'>{t('desk.edit.actions.submit')}</Button>
		</div>
	)
}

