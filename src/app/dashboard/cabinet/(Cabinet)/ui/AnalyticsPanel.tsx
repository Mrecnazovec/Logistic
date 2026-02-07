import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/Chart'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis, YAxis } from 'recharts'
import type { AnalyticsCard, IncomeChartDatum, TransportChartDatum } from '../types/cabinet'
import { AnalyticsDetailCard } from './AnalyticsDetailCard'

type TranslateFn = (...args: any[]) => string

type AnalyticsPanelProps = {
	t: TranslateFn
	isLoadingAnalytics: boolean
	detailCards: AnalyticsCard[]
	isRevenueOpen: boolean
	setIsRevenueOpen: (open: boolean) => void
	isTransportOpen: boolean
	setIsTransportOpen: (open: boolean) => void
	incomeChartConfig: ChartConfig
	incomeChartData: IncomeChartDatum[]
	transportChartConfig: ChartConfig
	transportChartData: TransportChartDatum[]
	integerFormatter: Intl.NumberFormat
	totalTransports: number
}

export function AnalyticsPanel({
	t,
	isLoadingAnalytics,
	detailCards,
	isRevenueOpen,
	setIsRevenueOpen,
	isTransportOpen,
	setIsTransportOpen,
	incomeChartConfig,
	incomeChartData,
	transportChartConfig,
	transportChartData,
	integerFormatter,
	totalTransports,
}: AnalyticsPanelProps) {
	return (
		<div className='lg:w-[68%] xl:w-[70%]'>
			<Card className='flex h-full flex-col gap-6 rounded-[32px] border-border/60 bg-background px-6 py-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)] sm:px-8'>
				<div className='flex items-center justify-between gap-3'>
					<h2 className='text-lg font-semibold text-brand'>{t('cabinet.analytics.title')}</h2>
				</div>

				<div className='grid gap-4 sm:grid-cols-2'>
					{detailCards.map((card) => (
						<AnalyticsDetailCard key={card.id} card={card} isLoadingAnalytics={isLoadingAnalytics} />
					))}

					<Dialog open={isTransportOpen} onOpenChange={setIsTransportOpen}>
						<DialogTrigger asChild>
							<Button variant='outline' className='h-10 border-brand/40 px-5 text-sm text-brand hover:border-brand/60 hover:bg-brand/5'>
								{t('cabinet.analytics.revenue')}
								<ArrowUpRight className='size-4' />
							</Button>
						</DialogTrigger>
						<DialogContent className='max-w-[860px] p-6 sm:p-8'>
							<DialogHeader>
								<DialogTitle className='text-center text-xl font-semibold'>{t('cabinet.analytics.dialogTitle')}</DialogTitle>
							</DialogHeader>
							<div className='space-y-4'>
								<div className='flex flex-wrap items-center justify-between gap-3'>
									<div className='flex flex-wrap gap-3'>
										<Button
											type='button'
											variant='outline'
											className='h-10 rounded-full border-transparent bg-muted/40 px-4 text-sm text-foreground hover:bg-muted/60'
										>
											2024
											<ChevronDown className='size-4 text-muted-foreground' />
										</Button>
										<Button
											type='button'
											variant='outline'
											className='h-10 rounded-full border-transparent bg-muted/40 px-4 text-sm text-foreground hover:bg-muted/60'
										>
											{t('cabinet.analytics.periodHalf')}
											<ChevronDown className='size-4 text-muted-foreground' />
										</Button>
									</div>
									<div className='flex flex-wrap items-center gap-4 text-xs text-muted-foreground'>
										{Object.entries(incomeChartConfig).map(([key, item]) => (
											<div key={key} className='flex items-center gap-2'>
												<span className='size-2 rounded-full' style={{ backgroundColor: item.color }} />
												<span>{item.label}</span>
											</div>
										))}
									</div>
								</div>
								<Card className='gap-4 rounded-[24px] border-border/60 bg-background px-4 py-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)] sm:px-6'>
									<p className='text-sm text-muted-foreground'>{t('cabinet.analytics.earned')}</p>
									<ChartContainer config={incomeChartConfig} className='h-[260px] w-full aspect-auto'>
										<BarChart data={incomeChartData} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
											<CartesianGrid strokeDasharray='3 3' vertical={false} />
											<XAxis dataKey='month' axisLine={false} tickLine={false} />
											<YAxis
												axisLine={false}
												tickLine={false}
												width={32}
												tickFormatter={(value) => t('cabinet.chart.thousand', { value: Math.round(value / 1000) })}
											/>
											<ChartTooltip content={<ChartTooltipContent hideLabel />} />
											<Bar dataKey='given' fill='var(--color-given)' radius={[8, 8, 0, 0]} barSize={10} />
											<Bar dataKey='received' fill='var(--color-received)' radius={[8, 8, 0, 0]} barSize={10} />
											<Bar dataKey='earned' fill='var(--color-earned)' radius={[8, 8, 0, 0]} barSize={10} />
										</BarChart>
									</ChartContainer>
								</Card>
							</div>
						</DialogContent>
					</Dialog>

					<Dialog open={isRevenueOpen} onOpenChange={setIsRevenueOpen}>
						<DialogTrigger asChild>
							<Button variant='outline' className='h-10 border-brand/40 px-5 text-sm text-brand hover:border-brand/60 hover:bg-brand/5'>
								{t('cabinet.analytics.transport')}
								<ArrowUpRight className='size-4' />
							</Button>
						</DialogTrigger>
						<DialogContent className='max-w-[520px] p-6 sm:p-8'>
							<DialogHeader>
								<DialogTitle className='text-center text-xl font-semibold'>{t('cabinet.analytics.dialogTitle')}</DialogTitle>
							</DialogHeader>
							<div className='rounded-[24px] border border-border/60 bg-background px-5 py-6 shadow-[0_10px_25px_rgba(15,23,42,0.05)] sm:px-6'>
								<p className='text-sm font-medium text-muted-foreground'>{t('cabinet.analytics.transportStats')}</p>
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
										<PieChart>
											<ChartTooltip content={<ChartTooltipContent hideLabel />} />
											<Pie data={transportChartData} dataKey='value' nameKey='status' innerRadius={70} strokeWidth={6} />
										</PieChart>
									</ChartContainer>
									<div className='pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center'>
										<span className='text-xs text-muted-foreground'>{t('cabinet.analytics.totalTransports')}</span>
										<span className='text-2xl font-semibold text-foreground'>{integerFormatter.format(totalTransports)}</span>
									</div>
								</div>
							</div>
						</DialogContent>
					</Dialog>
				</div>
			</Card>
		</div>
	)
}
