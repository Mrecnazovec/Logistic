"use client"

import { Link2, UserPlus } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/form-control/Input'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/form-control/InputGroup'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { useI18n } from '@/i18n/I18nProvider'
import { DEFAULT_PLACEHOLDER, formatDateValue } from '@/lib/formatters'
import { handlePriceInput } from '@/lib/InputValidation'
import type { DriverPaymentMethod, IOrderDetail } from '@/shared/types/Order.interface'
import { currencyOptions, paymentMethodOptions, useInviteDriverModalState } from '../hooks/useInviteDriverModalState'

interface InviteDriverModalProps {
  order: IOrderDetail
  canInviteById: boolean
}

export function InviteDriverModalView({ order, canInviteById }: InviteDriverModalProps) {
  const { t } = useI18n()
  const {
    isOpen,
    carrierId,
    setCarrierId,
    driverPrice,
    setDriverPrice,
    driverCurrency,
    setDriverCurrency,
    driverPaymentMethod,
    setDriverPaymentMethod,
    shareCopyStatus,
    isLoadingInviteById,
    isLoadingGenerateInvite,
    shareLink,
    formattedPrice,
    formattedPricePerKm,
    formattedRouteDistance,
    handleModalOpenChange,
    handleInviteCarrier,
    handleGenerateInviteLink,
    handleCopyShareLink,
  } = useInviteDriverModalState(order, canInviteById, t)

  return (
    <Dialog open={isOpen} onOpenChange={handleModalOpenChange}>
      <DialogTrigger asChild>
        <Button className='bg-brand text-white'>
          {t('components.inviteDriver.trigger')}
          <UserPlus className='ml-2 size-4' />
        </Button>
      </DialogTrigger>

      <DialogContent className='w-[900px] rounded-3xl lg:max-w-none'>
        <DialogHeader>
          <DialogTitle className='text-center text-2xl font-bold'>{t('components.inviteDriver.title')}</DialogTitle>
        </DialogHeader>

        <Card className='border-none shadow-none'>
          <CardContent className='flex flex-col gap-6 pt-6'>
            <div className='flex flex-wrap items-center justify-between gap-6 border-b-2 pb-6'>
              <div>
                <p>{order.origin_city}</p>
                <p>{formatDateValue(order.load_date, DEFAULT_PLACEHOLDER)}</p>
              </div>
              <div className='flex flex-col items-center justify-center gap-3 text-sm text-muted-foreground'>
                <Link2 className='size-5' />
                <p>{formattedRouteDistance}</p>
              </div>
              <div>
                <p>{order.destination_city}</p>
                <p>{formatDateValue(order.delivery_date, DEFAULT_PLACEHOLDER)}</p>
              </div>
              <div className='text-sm text-muted-foreground'>
                <p>{t('components.inviteDriver.price')}: {formattedPrice}</p>
                <p>({formattedPricePerKm})</p>
              </div>
            </div>

            <div className='flex flex-col gap-4'>
              <div className='space-y-2'>
                <p className='text-sm font-semibold text-foreground'>
                  {t('components.inviteDriver.driverPriceLabel', { maxPrice: formattedPrice })}
                </p>
                <div className='grid gap-3 md:grid-cols-[1fr_auto_auto]'>
                  <Input
                    type='text'
                    value={driverPrice}
                    onChange={(event) => handlePriceInput(event, setDriverPrice)}
                    placeholder={t('components.inviteDriver.driverPricePlaceholder')}
                    inputMode='numeric'
                  />
                  <Select
                    value={driverCurrency || undefined}
                    onValueChange={(value) => setDriverCurrency(value as (typeof currencyOptions)[number])}
                  >
                    <SelectTrigger className='w-full rounded-full border-none bg-grayscale-50 shadow-none *:data-[slot=select-value]:text-black'>
                      <SelectValue placeholder={t('components.offerModal.currencyPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {currencyOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={driverPaymentMethod || undefined}
                    onValueChange={(value) => setDriverPaymentMethod(value as DriverPaymentMethod)}
                  >
                    <SelectTrigger className='w-full rounded-full border-none bg-grayscale-50 shadow-none *:data-[slot=select-value]:text-black'>
                      <SelectValue placeholder={t('components.offerDecision.paymentPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethodOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {t(`shared.payment.${option === 'bank_transfer' ? 'bankTransfer' : option}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {canInviteById && (
                <div className='space-y-2'>
                  <p className='text-sm font-semibold text-foreground'>{t('components.inviteDriver.byId.title')}</p>
                  <InputGroup>
                    <InputGroupInput
                      type='number'
                      value={carrierId}
                      onChange={(event) => setCarrierId(event.target.value)}
                      placeholder={t('components.inviteDriver.byId.placeholder')}
                      className='pl-3'
                    />
                    <InputGroupAddon align='inline-end'>
                      <Button
                        size='sm'
                        variant='ghost'
                        className='flex items-center gap-2'
                        type='button'
                        onClick={handleInviteCarrier}
                        disabled={isLoadingInviteById}
                      >
                        {isLoadingInviteById ? t('components.inviteDriver.byId.loading') : t('components.inviteDriver.byId.submit')}
                        <Link2 className='size-4' />
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
                </div>
              )}

              {canInviteById && (
                <div className='space-y-2'>
                  <p className='text-sm font-semibold text-foreground'>{t('components.inviteDriver.byLink.title')}</p>
                  <p className='text-sm text-muted-foreground'>{t('components.inviteDriver.byLink.description')}</p>
                  <InputGroup>
                    <InputGroupInput readOnly value={shareLink} className='pl-3' placeholder={t('components.inviteDriver.byLink.placeholder')} />
                    <InputGroupAddon align='inline-end'>
                      <Button
                        size='sm'
                        variant='ghost'
                        className='flex items-center gap-2'
                        type='button'
                        onClick={shareLink ? handleCopyShareLink : handleGenerateInviteLink}
                        disabled={isLoadingGenerateInvite}
                      >
                        {shareLink ? t('components.inviteDriver.byLink.copy') : isLoadingGenerateInvite ? t('components.inviteDriver.byLink.loading') : t('components.inviteDriver.byLink.generate')}
                        <Link2 className='size-4' />
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
                  {shareCopyStatus === 'copied' && <p className='text-sm text-success-500'>{t('components.inviteDriver.copySuccess')}</p>}
                  {shareCopyStatus === 'error' && <p className='text-sm text-error-500'>{t('components.inviteDriver.copyError')}</p>}
                </div>
              )}
            </div>

            <div className='mt-2 flex gap-3 max-md:flex-col md:justify-end'>
              <DialogClose asChild>
                <Button className='bg-destructive text-white hover:bg-destructive/90 max-md:w-full' type='button'>
                  {t('components.inviteDriver.cancel')}
                </Button>
              </DialogClose>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
