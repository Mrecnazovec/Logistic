import { ProfileLink } from '@/components/ui/actions/ProfileLink'
import { DEFAULT_PLACEHOLDER } from '@/lib/formatters'
import type { IOrderDetail } from '@/shared/types/Order.interface'

type Props = {
	t: (...args: any[]) => string
	order: IOrderDetail
	hasDriver: boolean
	shouldHideCustomerContactsForCarrier: boolean
}

const withFallback = (value?: string | number | null, id?: number | null, shouldHide?: boolean) => {
	if (shouldHide) return DEFAULT_PLACEHOLDER
	if (value === null || value === undefined || value === '') return DEFAULT_PLACEHOLDER
	if (id) return <ProfileLink name={String(value)} id={id} />
	return String(value)
}

export function OrderParticipantsGrid({ t, order, hasDriver, shouldHideCustomerContactsForCarrier }: Props) {
	return (
		<div className='grid gap-15 lg:grid-cols-3'>
			{[
				{
					title: t('order.section.customerInfo'),
					rows: [
						{
							label: t('order.field.customer'),
							value: withFallback(order.roles.customer.name, order.roles.customer.id, shouldHideCustomerContactsForCarrier),
						},
						{ label: t('order.field.company'), value: withFallback(order.roles.customer.company) },
						{
							label: t('order.field.phone'),
							value: withFallback(order.roles.customer.phone, null, shouldHideCustomerContactsForCarrier),
						},
						{
							label: t('order.field.email'),
							value: withFallback(order.roles.customer.email, null, shouldHideCustomerContactsForCarrier),
						},
					],
				},
				{
					title: t('order.section.logisticInfo'),
					rows: [
						{
							label: t('order.field.logistic'),
							value: withFallback(order.roles.logistic?.name, order.roles.logistic?.id),
						},
						{ label: t('order.field.company'), value: withFallback(order.roles.logistic?.company) },
						{ label: t('order.field.phone'), value: withFallback(order.roles.logistic?.phone) },
						{ label: t('order.field.email'), value: withFallback(order.roles.logistic?.email) },
					],
				},
				{
					title: t('order.section.carrierInfo'),
					rows: [
						{
							label: t('order.field.carrier'),
							value: hasDriver ? withFallback(order.roles.carrier?.name, order.roles.carrier?.id) : DEFAULT_PLACEHOLDER,
						},
						{ label: t('order.field.company'), value: withFallback(order.roles.carrier?.company) },
						{ label: t('order.field.phone'), value: withFallback(order.roles.carrier?.phone) },
						{ label: t('order.field.email'), value: withFallback(order.roles.carrier?.email) },
					],
				},
			].map((section) => (
				<div key={section.title} className='space-y-3'>
					<p className='font-medium text-brand'>{section.title}</p>
					{section.rows.map((row) => (
						<p key={row.label} className='flex justify-between gap-3'>
							<span className='text-grayscale'>{row.label}</span>
							<span className='text-end font-medium'>{row.value}</span>
						</p>
					))}
				</div>
			))}
		</div>
	)
}
