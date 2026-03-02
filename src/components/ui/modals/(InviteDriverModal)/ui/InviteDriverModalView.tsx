"use client"

import { Link2, UserPlus } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/form-control/Input'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/form-control/InputGroup'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { DASHBOARD_URL } from '@/config/url.config'
import { useGenerateOrderInvite } from '@/hooks/queries/orders/useGenerateOrderInvite'
import { useInviteOrderById } from '@/hooks/queries/orders/useInviteOrderById'
import { useI18n } from '@/i18n/I18nProvider'
import { DEFAULT_PLACEHOLDER, formatDateValue, formatDistanceKm, formatPricePerKmValue, formatPriceValue } from '@/lib/formatters'
import { handlePriceInput, normalizePriceValueForPayload } from '@/lib/InputValidation'
import { PriceCurrencyEnum } from '@/shared/enums/PriceCurrency.enum'
import type { DriverPaymentMethod, IOrderDetail } from '@/shared/types/Order.interface'

interface InviteDriverModalProps {
  order: IOrderDetail
  canInviteById: boolean
}

type OrderInviteResult = IOrderDetail & { invite_token?: string }
type CopyState = 'idle' | 'copied' | 'error'
type CurrencyCode = PriceCurrencyEnum

const currencyOptions: CurrencyCode[] = ['UZS', 'USD', 'EUR', 'KZT', 'RUB']
const paymentMethodOptions: DriverPaymentMethod[] = ['cash', 'bank_transfer', 'both']

export function InviteDriverModalView({ order, canInviteById }: InviteDriverModalProps) {
  const { t } = useI18n()
  const [isOpen, setIsOpen] = useState(false)
  const [carrierId, setCarrierId] = useState('')
  const [driverPrice, setDriverPrice] = useState('')
  const [driverCurrency, setDriverCurrency] = useState<CurrencyCode | ''>(order.currency ?? '')
  const [driverPaymentMethod, setDriverPaymentMethod] = useState<DriverPaymentMethod | ''>('')
  const [shareCopyStatus, setShareCopyStatus] = useState<CopyState>('idle')

  const { inviteOrderById, isLoadingInviteById } = useInviteOrderById()
  const { generateOrderInvite, generatedOrder, isLoadingGenerateInvite, resetGenerateInvite } = useGenerateOrderInvite()

  const inviteData = generatedOrder as OrderInviteResult | undefined
  const inviteToken = inviteData?.invite_token
  const shareLink = inviteToken ? `${typeof window !== 'undefined' ? window.location.origin : ''}${DASHBOARD_URL.order(`invite/${inviteToken}`)}` : ''

  const handleModalOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setCarrierId('')
      setDriverPrice('')
      setDriverCurrency(order.currency ?? '')
      setDriverPaymentMethod('')
      setShareCopyStatus('idle')
      resetGenerateInvite()
    }
    setIsOpen(nextOpen)
  }

  const handleInviteCarrier = () => {
    if (!canInviteById) return

    const parsedCarrierId = Number(carrierId)
    if (!carrierId || Number.isNaN(parsedCarrierId)) {
      toast.error(t('components.inviteDriver.invalidId'))
      return
    }
    if (!driverPrice) {
      toast.error(t('components.inviteDriver.driverPriceRequired'))
      return
    }
    if (!driverCurrency) {
      toast.error(t('components.inviteDriver.driverCurrencyRequired'))
      return
    }
    if (!driverPaymentMethod) {
      toast.error(t('components.inviteDriver.driverPaymentRequired'))
      return
    }
    const normalizedDriverPrice = normalizePriceValueForPayload(driverPrice)
    if (!normalizedDriverPrice) {
      toast.error(t('components.inviteDriver.driverPriceRequired'))
      return
    }

    inviteOrderById(
      {
        id: String(order.id),
        payload: {
          driver_id: parsedCarrierId,
          driver_price: normalizedDriverPrice,
          driver_currency: driverCurrency,
          driver_payment_method: driverPaymentMethod,
        },
      },
      {
        onSuccess: () => setCarrierId(''),
      },
    )
  }

  const handleGenerateInviteLink = () => {
    if (!canInviteById) return
    if (!driverPrice) {
      toast.error(t('components.inviteDriver.driverPriceRequired'))
      return
    }
    if (!driverCurrency) {
      toast.error(t('components.inviteDriver.driverCurrencyRequired'))
      return
    }
    if (!driverPaymentMethod) {
      toast.error(t('components.inviteDriver.driverPaymentRequired'))
      return
    }
    const normalizedDriverPrice = normalizePriceValueForPayload(driverPrice)
    if (!normalizedDriverPrice) {
      toast.error(t('components.inviteDriver.driverPriceRequired'))
      return
    }
    setShareCopyStatus('idle')
    generateOrderInvite({
      id: String(order.id),
      payload: {
        cargo: order.cargo,
        driver_price: normalizedDriverPrice,
        driver_currency: driverCurrency,
        driver_payment_method: driverPaymentMethod,
      },
    })
  }

  const handleCopyShareLink = async () => {
    if (!shareLink) {
      toast.error(t('components.inviteDriver.generateFirst'))
      return
    }

    try {
      await navigator.clipboard.writeText(shareLink)
      setShareCopyStatus('copied')
      toast.success(t('components.inviteDriver.copySuccess'))
    } catch (error) {
      console.error(error)
      setShareCopyStatus('error')
      toast.error(t('components.inviteDriver.copyError'))
    }
  }

  const formattedPrice = formatPriceValue(order.price_total, order.currency)
  const formattedPricePerKm = formatPricePerKmValue(order.price_per_km, order.currency)
  const formattedRouteDistance = formatDistanceKm(order.route_distance_km, DEFAULT_PLACEHOLDER)

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
                    onValueChange={(value) => setDriverCurrency(value as CurrencyCode)}
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
