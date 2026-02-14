import { InvitePage } from './(InvitePage)'
import { getLocale } from '@/i18n/getLocale'
import { getMessages } from '@/i18n/messages'
import { addLocaleToPath } from '@/i18n/paths'
import { DASHBOARD_URL } from '@/config/url.config'
import { ordersService } from '@/services/orders.service'
import { SITE_URL } from '@/constants/seo.constants'
import type { InvitePreview } from '@/shared/types/Order.interface'
import { formatPriceValue } from '@/lib/formatters'
import type { PriceCurrencyCode } from '@/lib/currency'
import type { Metadata } from 'next'

type PageProps = {
	params: Promise<{ token?: string | string[] }>
}

const FALLBACK_SITE_URL = 'https://kad-one.com'

const resolveToken = async (params: PageProps['params']) => {
	const resolvedParams = await params
	const tokenParam = resolvedParams?.token
	return Array.isArray(tokenParam) ? tokenParam[0] : tokenParam
}

const resolveAbsoluteUrl = (path: string) => {
	try {
		return new URL(path, SITE_URL).toString()
	} catch {
		return new URL(path, FALLBACK_SITE_URL).toString()
	}
}

const getOrderInvitePreview = async (token?: string): Promise<InvitePreview | null> => {
	if (!token?.trim()) return null

	try {
		return await ordersService.getInvitePreview(token.trim())
	} catch {
		return null
	}
}

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
	const locale = await getLocale()
	const messages = getMessages(locale)
	const token = await resolveToken(params)
	const invitePreview = await getOrderInvitePreview(token)
	const defaultTitle = messages['order.invite.meta.title'] ?? 'Order invitation'
	const route = [invitePreview?.origin_city, invitePreview?.destination_city].filter(Boolean).join(' -> ')
	const title = route ? `${defaultTitle}: ${route}` : defaultTitle

	const price = formatPriceValue(invitePreview?.driver_price, invitePreview?.driver_currency as PriceCurrencyCode | null | undefined)
	const inviter = invitePreview?.inviter as { company?: string } | null | undefined
	const company = inviter?.company?.trim()
	const descriptionParts = [
		route || null,
		company ? `${messages['order.invite.company'] ?? 'Company'}: ${company}` : null,
		price && price !== '—' ? `${messages['order.field.price'] ?? 'Price'}: ${price}` : null,
	].filter(Boolean) as string[]
	const description =
		descriptionParts.join(' | ') ||
		messages['order.invite.form.description'] ||
		'Review invite details and accept the order invitation.'

	const invitePath = addLocaleToPath(DASHBOARD_URL.order(`invite/${token ?? ''}`), locale)
	const absoluteUrl = resolveAbsoluteUrl(invitePath)

	return {
		title,
		description,
		alternates: {
			canonical: invitePath,
		},
		openGraph: {
			title,
			description,
			url: absoluteUrl,
			type: 'website',
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
		},
	}
}

export default function Page() {
	return <InvitePage />
}
