"use client"

import * as React from 'react'
import { type TooltipProps, Legend as RechartsLegend, ResponsiveContainer, Tooltip } from 'recharts'
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent'

import { cn } from '@/lib/utils'

export type ChartConfig = Record<
	string,
	{
		label?: React.ReactNode
		color?: string
		icon?: React.ComponentType<{ className?: string }>
	}
>

const ChartContext = React.createContext<ChartConfig | null>(null)

const useChartConfig = () => {
	const config = React.useContext(ChartContext)
	if (!config) {
		throw new Error('Chart components must be used within ChartContainer')
	}
	return config
}

function ChartContainer({
	config,
	className,
	children,
	...props
}: React.ComponentProps<'div'> & {
	config: ChartConfig
	children: React.ReactNode
}) {
	const style = React.useMemo(() => {
		return Object.fromEntries(
			Object.entries(config)
				.filter(([, value]) => value?.color)
				.map(([key, value]) => [`--color-${key}`, value.color])
		) as React.CSSProperties
	}, [config])

	return (
		<ChartContext.Provider value={config}>
			<div
				className={cn('flex aspect-square w-full justify-center text-xs', className)}
				style={style}
				{...props}
			>
				<ResponsiveContainer>{children}</ResponsiveContainer>
			</div>
		</ChartContext.Provider>
	)
}

function ChartTooltip({ ...props }: TooltipProps<ValueType, NameType>) {
	return <Tooltip cursor={false} {...props} />
}

type ChartTooltipContentProps = TooltipProps<ValueType, NameType> & {
	hideLabel?: boolean
	payload?: Array<{ name?: string; dataKey?: string; value?: number | string; color?: string }>
	label?: string | number
	className?: string
}

function ChartTooltipContent({ active, payload, label, hideLabel, className }: ChartTooltipContentProps) {
	const config = useChartConfig()

	if (!active || !payload?.length) return null

	return (
		<div className={cn('rounded-lg border bg-background px-3 py-2 text-xs shadow', className)}>
			{!hideLabel ? <p className='mb-1 font-medium text-foreground'>{label}</p> : null}
			<div className='space-y-1'>
				{payload.map((item) => {
					const key = String(item.name ?? item.dataKey ?? '')
					const itemConfig = config[key]
					const dotColor = item.color ?? itemConfig?.color
					return (
						<div key={key} className='flex items-center gap-2'>
							<span className='size-2 rounded-full' style={dotColor ? { backgroundColor: dotColor } : undefined} />
							<span className='text-muted-foreground'>{itemConfig?.label ?? item.name}</span>
							<span className='ml-auto font-medium tabular-nums text-foreground'>{item.value}</span>
						</div>
					)
				})}
			</div>
		</div>
	)
}

function ChartLegend({ className, ...props }: React.ComponentProps<typeof RechartsLegend>) {
	return <RechartsLegend className={cn('flex flex-wrap justify-center gap-3 text-xs', className)} {...props} />
}

export { ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent }
