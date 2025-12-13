"use client"

import { Link2, UserPlus } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/form-control/InputGroup'
import { DASHBOARD_URL } from '@/config/url.config'
import { useGenerateOrderInvite } from '@/hooks/queries/orders/useGenerateOrderInvite'
import { useInviteOrderById } from '@/hooks/queries/orders/useInviteOrderById'
import { DEFAULT_PLACEHOLDER, formatDateValue, formatDistanceKm, formatPricePerKmValue, formatPriceValue } from '@/lib/formatters'
import type { IOrderDetail } from '@/shared/types/Order.interface'

interface InviteDriverModalProps {
    order: IOrderDetail
    canInviteById: boolean
}

type OrderInviteResult = IOrderDetail & { invite_token?: string }
type CopyState = 'idle' | 'copied' | 'error'

export function InviteDriverModal({ order, canInviteById }: InviteDriverModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [carrierId, setCarrierId] = useState('')
    const [shareCopyStatus, setShareCopyStatus] = useState<CopyState>('idle')

    const { inviteOrderById, isLoadingInviteById } = useInviteOrderById()
    const { generateOrderInvite, generatedOrder, isLoadingGenerateInvite, resetGenerateInvite } = useGenerateOrderInvite()

    const inviteData = generatedOrder as OrderInviteResult | undefined
    const inviteToken = inviteData?.invite_token
    const shareLink = inviteToken ? `${typeof window !== 'undefined' ? window.location.origin : ''}${DASHBOARD_URL.order(`invite/${inviteToken}`)}` : ''

    const handleModalOpenChange = (nextOpen: boolean) => {
        if (!nextOpen) {
            setCarrierId('')
            setShareCopyStatus('idle')
            resetGenerateInvite()
        }
        setIsOpen(nextOpen)
    }

    const handleInviteCarrier = () => {
        if (!canInviteById) return

        const parsedCarrierId = Number(carrierId)
        if (!carrierId || Number.isNaN(parsedCarrierId)) {
            toast.error('Введите корректный ID перевозчика.')
            return
        }

        inviteOrderById(
            { id: String(order.id), payload: { driver_id: parsedCarrierId } },
            {
                onSuccess: () => setCarrierId(''),
            },
        )
    }

    const handleGenerateInviteLink = () => {
        if (!canInviteById) return
        setShareCopyStatus('idle')
        generateOrderInvite(
            { id: String(order.id), payload: { cargo: order.cargo } },
            {
                onSuccess: () => {
                    setShareCopyStatus('idle')
                },
            },
        )
    }

    const handleCopyShareLink = async () => {
        if (!shareLink) {
            toast.error('Сначала сгенерируйте ссылку.')
            return
        }

        try {
            await navigator.clipboard.writeText(shareLink)
            setShareCopyStatus('copied')
            toast.success('Ссылка скопирована.')
        } catch (error) {
            console.error(error)
            setShareCopyStatus('error')
            toast.error('Не удалось скопировать ссылку.')
        }
    }

    const formattedPrice = formatPriceValue(order.price_total, order.currency)
    const formattedPricePerKm = formatPricePerKmValue(order.price_per_km, order.currency)
    const formattedRouteDistance = formatDistanceKm(order.route_distance_km, DEFAULT_PLACEHOLDER)

    return (
        <Dialog open={isOpen} onOpenChange={handleModalOpenChange}>
            <DialogTrigger asChild>
                <Button className='bg-brand text-white'>
                    Пригласить водителя
                    <UserPlus className='ml-2 size-4' />
                </Button>
            </DialogTrigger>

            <DialogContent className='w-[900px] rounded-3xl lg:max-w-none'>
                <DialogHeader>
                    <DialogTitle className='text-center text-2xl font-bold'>Приглашение водителя</DialogTitle>
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
                                <p>Стоимость: {formattedPrice}</p>
                                <p>({formattedPricePerKm})</p>
                            </div>
                        </div>

                        <div className='flex flex-col gap-4'>
                            {canInviteById && (
                                <div className='space-y-2'>
                                    <p className='text-sm font-semibold text-foreground'>Пригласить перевозчика по ID</p>
                                    <InputGroup className='bg-background'>
                                        <InputGroupInput
                                            type='number'
                                            value={carrierId}
                                            onChange={(event) => setCarrierId(event.target.value)}
                                            placeholder='Введите ID перевозчика'
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
                                                {isLoadingInviteById ? 'Отправка...' : 'Пригласить'}
                                                <Link2 className='size-4' />
                                            </Button>
                                        </InputGroupAddon>
                                    </InputGroup>
                                </div>
                            )}

                            {canInviteById && (
                                <div className='space-y-2'>
                                    <p className='text-sm font-semibold text-foreground'>Приглашение по ссылке</p>
                                    <p className='text-sm text-muted-foreground'>Сгенерируйте ссылку и отправьте её водителю, чтобы он смог принять приглашение.</p>
                                    <InputGroup className='bg-background'>
                                        <InputGroupInput readOnly value={shareLink} placeholder='Ссылка появится после генерации' />
                                        <InputGroupAddon align='inline-end'>
                                            <Button
                                                size='sm'
                                                variant='ghost'
                                                className='flex items-center gap-2'
                                                type='button'
                                                onClick={shareLink ? handleCopyShareLink : handleGenerateInviteLink}
                                                disabled={isLoadingGenerateInvite}
                                            >
                                                {shareLink ? 'Скопировать ссылку' : isLoadingGenerateInvite ? 'Создаём...' : 'Сгенерировать ссылку'}
                                                <Link2 className='size-4' />
                                            </Button>
                                        </InputGroupAddon>
                                    </InputGroup>
                                    {shareCopyStatus === 'copied' && <p className='text-sm text-success-500'>Ссылка скопирована.</p>}
                                    {shareCopyStatus === 'error' && <p className='text-sm text-error-500'>Не удалось скопировать ссылку.</p>}
                                </div>
                            )}
                        </div>

                        <div className='mt-2 flex gap-3 max-md:flex-col md:justify-end'>
                            <DialogClose asChild>
                                <Button className='bg-destructive text-white hover:bg-destructive/90 max-md:w-full' type='button'>
                                    Отменить
                                </Button>
                            </DialogClose>
                        </div>
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    )
}
