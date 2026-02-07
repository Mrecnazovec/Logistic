'use client'

import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/Chart'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/form-control/Input'
import { Label } from '@/components/ui/form-control/Label'
import { NoPhoto } from '@/components/ui/NoPhoto'
import { Skeleton } from '@/components/ui/Skeleton'
import { ArrowUpRight } from 'lucide-react'
import { Pie, PieChart as RechartsPieChart } from 'recharts'

type IdProfileViewProps = {
	t: (...args: any[]) => string
	ratingUser: any
	isLoading: boolean
	isTransportOpen: boolean
	setIsTransportOpen: (open: boolean) => void
	integerFormatter: Intl.NumberFormat
	transportChartConfig: any
	transportChartData: Array<{ status: string; label: string; value: number; fill: string }>
	totalTransports: number
	stats: Array<{
		id: string
		label: string
		value: string
		sub?: string
		icon: any
		accentClass: string
		trend?: string
		trendClass?: string
		trendLabel?: string
	}>
}

export function IdProfileView({
	t,
	ratingUser,
	isLoading,
	isTransportOpen,
	setIsTransportOpen,
	integerFormatter,
	transportChartConfig,
	transportChartData,
	totalTransports,
	stats,
}: IdProfileViewProps) {
	if (isLoading) {
		return (
			<Card className='rounded-[32px] border-border/40 bg-background px-6 py-8 shadow-[0_18px_40px_rgba(15,23,42,0.06)] sm:px-8'>
				<div className='flex flex-col gap-8 lg:flex-row'>
					<div className='lg:w-[38%]'>
						<div className='flex items-start gap-4'>
							<Skeleton className='size-20 rounded-full' />
							<div className='flex-1 space-y-2'>
								<Skeleton className='h-5 w-40 rounded-full' />
								<Skeleton className='h-4 w-32 rounded-full' />
							</div>
						</div>
						<div className='mt-8 space-y-4'>
							{Array.from({ length: 3 }).map((_, index) => (
								<div key={index} className='space-y-2'>
									<Skeleton className='h-3 w-20 rounded-full' />
									<Skeleton className='h-11 w-full rounded-3xl' />
								</div>
							))}
							<Skeleton className='h-10 w-full rounded-full' />
						</div>
					</div>
					<div className='lg:w-[62%]'>
						<div className='grid gap-4 sm:grid-cols-2'>
							{Array.from({ length: 4 }).map((_, index) => (
								<Card key={index} className='rounded-[24px] border-border/40 px-5 py-5 shadow-sm'>
									<Skeleton className='h-4 w-24 rounded-full' />
									<Skeleton className='mt-3 h-6 w-20 rounded-full' />
									<Skeleton className='mt-2 h-3 w-28 rounded-full' />
								</Card>
							))}
						</div>
					</div>
				</div>
			</Card>
		)
	}

	if (!ratingUser) {
		return (
			<Card className='rounded-[28px] border-border/50 px-6 py-8 text-center text-muted-foreground shadow-sm'>
				{t('profile.unavailable')}
			</Card>
		)
	}

	return (
		<Card className='h-full rounded-[32px] border-border/40 bg-background px-6 py-8 shadow-[0_18px_40px_rgba(15,23,42,0.06)] sm:px-8'>
			<div className='flex items-center gap-4'>
				<NoPhoto className='size-20' />
				<div className='space-y-1'>
					<p className='text-xl font-semibold text-foreground'>{ratingUser.company_name || ratingUser.display_name}</p>
					<div className='flex items-center gap-2 text-sm text-muted-foreground'>
						<span>{t('profile.idLabel')}</span>
						<UuidCopy id={ratingUser.id} isPlaceholder />
					</div>
				</div>
			</div>

			<div className='mt-8 grid gap-6 sm:grid-cols-2'>
				<div className='space-y-4'>
					<div className='space-y-2'>
						<Label className='text-xs text-muted-foreground' htmlFor='full-name'>
							{t('profile.field.fullName')}
						</Label>
						<Input disabled id='full-name' value={ratingUser.display_name || ''} className='rounded-full disabled:opacity-100' />
					</div>
					<div className='space-y-2'>
						<Label className='text-xs text-muted-foreground' htmlFor='country'>
							{t('profile.field.country')}
						</Label>
						<Input disabled id='country' value={ratingUser.country || ''} className='rounded-full disabled:opacity-100' />
					</div>
					<div className='space-y-2'>
						<Label className='text-xs text-muted-foreground' htmlFor='city'>
							{t('profile.field.city')}
						</Label>
						<Input disabled id='city' value={ratingUser.city || ''} className='rounded-full disabled:opacity-100' />
					</div>
					<Dialog open={isTransportOpen} onOpenChange={setIsTransportOpen}>
						<DialogTrigger asChild>
							<Button variant='outline' className='h-11 w-full rounded-full border-brand/40 text-sm text-brand hover:border-brand/60 hover:bg-brand/5'>
								{t('profile.analytics.button')}
								<ArrowUpRight className='size-4' />
							</Button>
						</DialogTrigger>
						<DialogContent className='max-w-[520px] p-6 sm:p-8'>
							<DialogHeader>
								<DialogTitle className='text-center text-xl font-semibold'>{t('profile.analytics.title')}</DialogTitle>
							</DialogHeader>
							<div className='rounded-[24px] border border-border/60 bg-background px-5 py-6 shadow-[0_10px_25px_rgba(15,23,42,0.05)] sm:px-6'>
								<p className='text-sm font-medium text-muted-foreground'>{t('profile.analytics.subtitle')}</p>
								<div className='mt-4 space-y-2 text-sm'>
									{transportChartData.map((item) => (
										<div key={item.status} className='flex items-center justify-between gap-2 text-muted-foreground'>
											<span className='flex items-center gap-2'>
												<span className='size-2 rounded-full' style={{ backgroundColor: item.fill }} />
												<span>{item.label}</span>
											</span>
											<span className='font-medium text-foreground'>{integerFormatter.format(item.value)}</span>
										</div>
									))}
								</div>
								<div className='relative mt-6'>
									<ChartContainer config={transportChartConfig} className='mx-auto max-h-[240px]'>
										<RechartsPieChart>
											<ChartTooltip content={<ChartTooltipContent hideLabel />} />
											<Pie data={transportChartData} dataKey='value' nameKey='status' innerRadius={70} strokeWidth={6} />
										</RechartsPieChart>
									</ChartContainer>
									<div className='pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center'>
										<span className='text-xs text-muted-foreground'>{t('profile.analytics.total')}</span>
										<span className='text-2xl font-semibold text-foreground'>{integerFormatter.format(totalTransports)}</span>
									</div>
								</div>
							</div>
						</DialogContent>
					</Dialog>
				</div>
				<div className='grid gap-4 sm:grid-cols-2'>
					{stats.map((item) => (
						<Card key={item.id} className='rounded-[24px] border-border/40 px-6 py-5 shadow-sm'>
							<div className='flex items-start justify-between gap-3'>
								<div className='space-y-2'>
									<p className='text-sm text-muted-foreground'>{item.label}</p>
									<p className='text-xl font-semibold text-foreground'>{item.value}</p>
								</div>
								<div className={`flex size-11 items-center justify-center rounded-full ${item.accentClass}`}>
									<item.icon className='size-5' />
								</div>
							</div>
							<div className='mt-3 space-y-2 text-xs text-muted-foreground'>
								{item.trend ? (
									<div className='flex items-center gap-2'>
										<span className={`rounded-full px-2 py-0.5 text-xs font-medium ${item.trendClass}`}>{item.trend}</span>
										<span>{item.trendLabel}</span>
									</div>
								) : null}
								{item.sub ? <p>{item.sub}</p> : null}
							</div>
						</Card>
					))}
				</div>
			</div>
		</Card>
	)
}
