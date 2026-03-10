import { Button } from '@/components/ui/Button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/Dialog'
import { DASHBOARD_URL } from '@/config/url.config'
import { useI18n } from '@/i18n/I18nProvider'
import { CargoPublishRequestDto } from '@/shared/types/CargoPublish.interface'
import { useRouter } from 'next/navigation'
import { UseFormReturn } from 'react-hook-form'

type PostingActionsProps = {
	form: UseFormReturn<CargoPublishRequestDto>
	isLoadingCreate: boolean
}

export function PostingActions({ form, isLoadingCreate }: PostingActionsProps) {
	const { t } = useI18n()
	const router = useRouter()

	return (
		<div className='mt-4 flex items-center sm:justify-end justify-center gap-4'>
			<Dialog>
				<DialogTrigger asChild>
					<Button variant='outline'>{t('announcements.posting.actions.cancel')}</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogTitle>{t('announcements.posting.cancel.title')}</DialogTitle>
					<DialogDescription>{t('announcements.posting.cancel.description')}</DialogDescription>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant='outline'>{t('announcements.posting.cancel.close')}</Button>
						</DialogClose>
						<DialogClose asChild>
							<Button onClick={() => router.push(DASHBOARD_URL.announcements())}>{t('announcements.posting.cancel.clear')}</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Button disabled={isLoadingCreate} type='submit'>
				{t('announcements.posting.actions.submit')}
			</Button>
		</div>
	)
}
