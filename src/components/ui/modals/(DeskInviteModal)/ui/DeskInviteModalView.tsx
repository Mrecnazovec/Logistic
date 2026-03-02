'use client'

import { ArrowRight, Link2 } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/form-control/InputGroup'
import { useI18n } from '@/i18n/I18nProvider'
import { ICargoList } from '@/shared/types/CargoList.interface'
import { useDeskInviteModalState } from '../hooks/useDeskInviteModalState'

interface OfferModalProps {
	selectedRow?: ICargoList
	className?: string
	open?: boolean
	onOpenChange?: (open: boolean) => void
}

export function DeskInviteModalView({ selectedRow, open, onOpenChange }: OfferModalProps) {
	const { t, locale } = useI18n()
	const {
		transportName,
		formattedPrice,
		formattedPricePerKm,
		shareLink,
		shareCopyStatus,
		carrierId,
		setCarrierId,
		isLoadingGenerate,
		isLoadingInviteOffer,
		formattedLoadDate,
		formattedDeliveryDate,
		handleModalOpenChange,
		handleInviteCarrier,
		handleGenerateInviteLink,
		handleCopyShareLink,
	} = useDeskInviteModalState(selectedRow, locale, t)

	return (
		<Dialog open={open} onOpenChange={(isOpen) => handleModalOpenChange(isOpen, onOpenChange)}>
			<DialogContent className='w-[900px] lg:max-w-none rounded-3xl'>
				<DialogHeader>
					<DialogTitle className='text-center text-2xl font-bold'>{t('components.deskInvite.title')}</DialogTitle>
				</DialogHeader>

				{!selectedRow ? (
					<p className='py-6 text-center text-muted-foreground'>
						{t('components.deskInvite.empty')}
					</p>
				) : (
					<div className='space-y-6'>
						<Card key={selectedRow.uuid} className='border-none shadow-none'>
							<CardContent className='flex flex-col gap-6 pt-6'>
								<div className='flex flex-wrap items-center justify-between gap-6 border-b-2 pb-6'>
									<div>
										<p>
											{selectedRow.origin_city}, {selectedRow.origin_country}
										</p>
										<p>{formattedLoadDate}</p>
									</div>
									<div className='flex flex-col items-center justify-center gap-3 text-sm text-muted-foreground'>
										<ArrowRight className='size-5' />
										<p>{selectedRow.route_km} {t('components.deskInvite.km')}</p>
									</div>
									<div>
										<p>
											{selectedRow.destination_city}, {selectedRow.destination_country}
										</p>
										<p>
											{formattedDeliveryDate}
										</p>
									</div>
									<div className='text-sm text-muted-foreground'>
										<p>{t('components.deskInvite.transport')}: {transportName}</p>
										<p>{t('components.deskInvite.weight')}: {selectedRow.weight_t} {t('components.deskInvite.ton')}</p>
										<p>{t('components.deskInvite.price')}: {formattedPrice}</p>
										<p>({formattedPricePerKm})</p>
									</div>
								</div>

								<div className='flex flex-wrap items-center justify-between gap-6 border-b-2 pb-6'>
									<p>
										<span className='font-semibold text-foreground'>{t('components.deskInvite.company')}: </span>
										{selectedRow.company_name}
									</p>
									<p className='font-semibold text-foreground'>
										{t('components.deskInvite.offer')}: {formattedPrice} ({formattedPricePerKm})
									</p>
								</div>

								<div className='flex flex-col gap-3 pt-2'>

									<div className='space-y-2'>
										<p className='text-sm font-semibold text-foreground'>{t('components.deskInvite.byId.title')}</p>
										<InputGroup>
											<InputGroupInput
												type='number'
												value={carrierId}
												onChange={(event) => setCarrierId(event.target.value)}
												placeholder={t('components.deskInvite.byId.placeholder')}
												className='pl-3'
											/>
											<InputGroupAddon align='inline-end'>
												<Button
													size='sm'
													variant='ghost'
													className='flex items-center gap-2'
													type='button'
													onClick={handleInviteCarrier}
													disabled={isLoadingInviteOffer}
												>
													{isLoadingInviteOffer ? t('components.deskInvite.byId.loading') : t('components.deskInvite.byId.submit')}
													<Link2 className='size-4' />
												</Button>
											</InputGroupAddon>
										</InputGroup>
									</div>
									<p className='text-sm font-semibold text-foreground'>{t('components.deskInvite.byLink.title')}</p>
									<p className='text-sm text-muted-foreground'>
										{t('components.deskInvite.byLink.description')}
									</p>
									<InputGroup>
										<InputGroupInput
											readOnly
											value={shareLink}
											placeholder={t('components.deskInvite.byLink.placeholder')}
											className='pl-3'
										/>
										<InputGroupAddon align='inline-end'>
											<Button
												size='sm'
												variant='ghost'
												className='flex items-center gap-2'
												type='button'
												onClick={shareLink ? handleCopyShareLink : handleGenerateInviteLink}
												disabled={isLoadingGenerate}
											>
												{shareLink ? t('components.deskInvite.byLink.copy') : isLoadingGenerate ? t('components.deskInvite.byLink.loading') : t('components.deskInvite.byLink.generate')}
												<Link2 className='size-4' />
											</Button>
										</InputGroupAddon>
									</InputGroup>
									{shareCopyStatus === 'copied' && (
										<p className='text-sm text-success-500'>{t('components.deskInvite.copySuccess')}</p>
									)}
									{shareCopyStatus === 'error' && (
										<p className='text-sm text-error-500'>{t('components.deskInvite.copyError')}</p>
									)}
								</div>

								<div className='mt-2 flex max-md:flex-col md:justify-end gap-3'>
									<DialogClose asChild>
										<Button
											className='max-md:w-full bg-destructive text-white hover:bg-destructive/90'
											type='button'
										>
											{t('components.deskInvite.cancel')}
										</Button>
									</DialogClose>
								</div>
							</CardContent>
						</Card>
					</div>
				)}
			</DialogContent>
		</Dialog>
	)
}
