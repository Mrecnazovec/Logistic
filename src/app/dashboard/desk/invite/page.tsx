'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { CheckCircle2, Loader2, TriangleAlert } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { DASHBOARD_URL } from '@/config/url.config'
import { useInviteOffer } from '@/hooks/queries/offers/useAction/useInviteOffer'
import { useGetMe } from '@/hooks/queries/me/useGetMe'
import type { PriceCurrencyCode } from '@/shared/utils/currency'

type InviteStatus = 'idle' | 'pending' | 'success' | 'error'

const currencyCodes: PriceCurrencyCode[] = ['UZS', 'USD', 'EUR', 'KZT', 'RUB']
const isCurrencyCode = (value: string | null): value is PriceCurrencyCode =>
	currencyCodes.includes((value || '') as PriceCurrencyCode)

export default function InvitePage() {
	const searchParams = useSearchParams()
	const cargoIdParam = searchParams.get('cargo')
	const priceValueParam = searchParams.get('price')
	const currencyParam = searchParams.get('currency')

	const { inviteOffer, isLoadingInvite } = useInviteOffer()
	const { me, isLoading: isLoadingMe } = useGetMe()
	const currencyFromLink = useMemo<PriceCurrencyCode>(
		() => (isCurrencyCode(currencyParam) ? (currencyParam as PriceCurrencyCode) : 'UZS'),
		[currencyParam],
	)

	const inviteParams = (() => {
		if (!cargoIdParam) {
			return {
				payload: null,
				error: 'В ссылке нет данных о грузе.',
			}
		}

		if (!me?.id) {
			return {
				payload: null,
				error: isLoadingMe ? null : 'Не удалось определить ваш профиль перевозчика.',
			}
		}

		const cargoIdNumber = Number(cargoIdParam)

		if (!Number.isFinite(cargoIdNumber)) {
			return {
				payload: null,
				error: 'Некорректные параметры ссылки.',
			}
		}

		return {
			payload: {
				cargo: cargoIdNumber,
				carrier_id: me.id,
				price_value: priceValueParam ?? undefined,
				price_currency: currencyFromLink,
			},
			error: null,
		}
	})()

	const [resultStatus, setResultStatus] = useState<InviteStatus>('idle')
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const inviteStartedRef = useRef(false)

	useEffect(() => {
		if (!inviteParams.payload || inviteStartedRef.current) return

		inviteStartedRef.current = true
		inviteOffer(inviteParams.payload, {
			onSuccess: () => setResultStatus('success'),
			onError: () => {
				setResultStatus('error')
				setErrorMessage('Не удалось создать приглашение. Попробуйте снова или обратитесь к диспетчеру.')
			},
		})
	}, [inviteOffer, inviteParams.payload])

	const displayError = inviteParams.error || errorMessage
	const isPending =
		(isLoadingMe && !inviteParams.error) ||
		(inviteParams.payload && resultStatus === 'idle')
	const isSuccess = resultStatus === 'success'
	const isError = resultStatus === 'error' || Boolean(displayError)

	return (
		<div className='flex min-h-[60vh] items-center justify-center px-4 py-12'>
			<Card className='w-full max-w-xl rounded-3xl'>
				<CardHeader className='text-center'>
					<CardTitle className='text-2xl font-bold'>Приглашение по ссылке</CardTitle>
				</CardHeader>

				<CardContent className='space-y-4 text-center'>
					{isPending && !isSuccess && !isError && (
						<div className='flex flex-col items-center gap-2 text-muted-foreground'>
							<Loader2 className='size-10 animate-spin text-brand' />
							<p>Создаём предложение для вашего профиля...</p>
						</div>
					)}

					{isSuccess && (
						<div className='flex flex-col items-center gap-2 text-center'>
							<CheckCircle2 className='size-10 text-success-500' />
							<p className='text-lg font-semibold text-foreground'>
								Предложение создано и добавлено в ваши сделки.
							</p>
							<p className='text-sm text-muted-foreground'>
								Проверьте раздел &laquo;Мои предложения&raquo; в кабинете.
							</p>
						</div>
					)}

					{isError && (
						<div className='flex flex-col items-center gap-2 text-center'>
							<TriangleAlert className='size-10 text-warning-500' />
							<p className='text-lg font-semibold text-foreground'>Не получилось создать приглашение.</p>
							<p className='text-sm text-muted-foreground'>
								{displayError || 'Проверьте ссылку и попробуйте ещё раз.'}
							</p>
						</div>
					)}
				</CardContent>

				<CardFooter className='flex flex-wrap justify-center gap-3'>
					<Link href={DASHBOARD_URL.desk('my')}>
						<Button variant='outline'>Перейти в мои предложения</Button>
					</Link>
					<Link href={DASHBOARD_URL.desk()}>
						<Button variant='ghost'>На главную кабинета</Button>
					</Link>
				</CardFooter>
			</Card>
		</div>
	)
}
