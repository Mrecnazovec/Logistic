'use client'

import { CheckCircle2, ShieldX } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useState, useSyncExternalStore } from 'react'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/form-control/Input'
import { Loader } from '@/components/ui/Loader'
import { DASHBOARD_URL } from '@/config/url.config'
import { useAcceptOrderInvite } from '@/hooks/queries/orders/useAcceptOrderInvite'
import { getAccessToken } from '@/services/auth/auth-token.service'

export function InvitePage() {
	const isHydrated = useSyncExternalStore(
		(callback) => {
			callback()
			return () => {}
		},
		() => true,
		() => false,
	)

	if (!isHydrated) {
		return <InvitePageFallback />
	}

	return <InvitePageContent />
}

function InvitePageContent() {
	const params = useParams<{ token: string }>()
	const router = useRouter()
	const accessToken = getAccessToken()
	const initialToken = params?.token ?? ''
	const [token, setToken] = useState(initialToken)
	const [acceptedOrderId, setAcceptedOrderId] = useState<number | null>(null)
	const { acceptOrderInvite, isLoadingAcceptInvite } = useAcceptOrderInvite()

	const handleAccept = () => {
		const trimmed = token.trim()
		if (!trimmed) {
			toast.error('Введите токен приглашения.')
			return
		}

		acceptOrderInvite(
			{ token: trimmed },
			{
				onSuccess: (order) => {
					setAcceptedOrderId(order?.id ?? null)
				},
			},
		)
	}

	if (!accessToken) {
		return (
			<InviteLayout>
				<InviteStateCard
					title="Требуется авторизация"
					description="Войдите в аккаунт, чтобы принять приглашение."
					icon={<ShieldX className="size-10 text-brand" />}
					actions={
						<Link href="/auth">
							<Button>Войти</Button>
						</Link>
					}
				/>
			</InviteLayout>
		)
	}

	if (acceptedOrderId) {
		return (
			<InviteLayout>
				<InviteStateCard
					title="Вы добавлены в заказ"
					description="Приглашение успешно принято."
					icon={<CheckCircle2 className="size-10 text-success-500" />}
					actions={
						<Link href={DASHBOARD_URL.order(String(acceptedOrderId))}>
							<Button className="bg-brand text-white">Перейти к заказу</Button>
						</Link>
					}
				/>
			</InviteLayout>
		)
	}

	return (
		<InviteLayout>
			<Card className="w-full max-w-xl rounded-3xl border-none shadow-lg">
				<CardHeader className="pb-4">
					<CardTitle className="text-2xl font-bold">Принять приглашение в заказ</CardTitle>
					<p className="text-sm text-muted-foreground">Введите полученный токен и подтвердите участие.</p>
				</CardHeader>
				<CardContent className="space-y-4">
					<Input
						value={token}
						onChange={(event) => setToken(event.target.value)}
						placeholder="Токен приглашения"
						disabled={isLoadingAcceptInvite}
					/>
					<div className="flex justify-end gap-3">
						<Button variant="outline" onClick={() => setToken(initialToken)} disabled={isLoadingAcceptInvite}>
							Сбросить
						</Button>
						<Button onClick={handleAccept} disabled={isLoadingAcceptInvite} className="bg-brand text-white">
							{isLoadingAcceptInvite ? 'Принятие...' : 'Принять приглашение'}
						</Button>
					</div>
				</CardContent>
			</Card>
		</InviteLayout>
	)
}

function InvitePageFallback() {
	return (
		<InviteLayout>
			<div className="flex flex-col items-center gap-3 text-muted-foreground">
				<Loader />
				<p>Загрузка приглашения...</p>
			</div>
		</InviteLayout>
	)
}

function InviteLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="h-full bg-background rounded-4xl flex items-center justify-center">
			{children}
		</div>
	)
}

function InviteStateCard({
	title,
	description,
	icon,
	actions,
}: {
	title: string
	description: string
	icon?: React.ReactNode
	actions?: React.ReactNode
}) {
	return (
		<Card className="w-full max-w-xl text-center rounded-3xl shadow-lg border-none">
			<CardContent className="py-10 flex flex-col items-center gap-4">
				{icon}
				<div className="space-y-1">
					<p className="text-xl font-semibold text-foreground">{title}</p>
					<p className="text-sm text-muted-foreground">{description}</p>
				</div>
				{actions}
			</CardContent>
		</Card>
	)
}
