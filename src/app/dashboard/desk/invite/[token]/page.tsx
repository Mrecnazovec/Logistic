import type { Metadata } from 'next'
import { InvitePage } from './(InvitePage)'
import { getLocale } from '@/i18n/getLocale'
import { getMessages } from '@/i18n/messages'
import { addLocaleToPath } from '@/i18n/paths'
import { DASHBOARD_URL } from '@/config/url.config'
import { axiosClassic } from '@/api/api.interceptors'
import { API_URL } from '@/config/api.config'
import { SITE_URL } from '@/constants/seo.constants'
import { DEFAULT_PLACEHOLDER, formatPriceValue } from '@/lib/formatters'
import type { components } from '@/shared/types/api'

type PageProps = {
	params: Promise<{ token?: string | string[] }>
}

type OpenInviteResponse = components['schemas']['OpenInviteResponse']

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

const getDeskInvitePreview = async (token?: string): Promise<OpenInviteResponse | null> => {
	if (!token?.trim()) return null

	try {
		const { data } = await axiosClassic<OpenInviteResponse>({
			url: API_URL.loads(`invite/${token.trim()}`),
			method: 'GET',
		})
		return data
	} catch {
		return null
	}
}

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
	const locale = await getLocale()
	const messages = getMessages(locale)
	const token = await resolveToken(params)
	const invitePreview = await getDeskInvitePreview(token)
	const cargo = invitePreview?.cargo
	const defaultTitle = messages['desk.invite.meta.title'] ?? 'Invite'
	const route = [cargo?.origin_city, cargo?.destination_city].filter(Boolean).join(' -> ')
	const title = route ? `${defaultTitle}: ${route}` : defaultTitle

	const price = formatPriceValue(cargo?.price_value, cargo?.price_currency)
	const company = cargo?.company_name?.trim()
	const descriptionParts = [
		route || null,
		company ? `${messages['desk.invite.company'] ?? 'Company'}: ${company}` : null,
		price && price !== DEFAULT_PLACEHOLDER ? `${messages['desk.invite.price'] ?? 'Price'}: ${price}` : null,
	].filter(Boolean) as string[]
	const description =
		descriptionParts.join(' | ') ||
		messages['desk.invite.notFound.description'] ||
		'Review invite details and respond to the offer.'

	const invitePath = addLocaleToPath(DASHBOARD_URL.desk(`invite/${token ?? ''}`), locale)
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
