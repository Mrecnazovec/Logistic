'use client'

import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { ICargoList } from '@/shared/types/CargoList.interface'
import { Button } from '@/components/ui/Button'
import { DataTable } from '@/components/ui/table/DataTable'

interface CargoTableProps {
	data: ICargoList[]
	isLoading?: boolean
}

export function CargoTable({ data, isLoading }: CargoTableProps) {
	const [expandedRow, setExpandedRow] = React.useState<number | null>(null)

	const columns: ColumnDef<ICargoList>[] = [
		{
			id: 'expand',
			cell: ({ row }) => {
				const cargo = row.original
				const isExpanded = expandedRow === cargo.id
				return (
					<Button
						variant='ghost'
						size='icon'
						className='h-6 w-6'
						onClick={() =>
							setExpandedRow(isExpanded ? null : cargo.id)
						}
					>
						{isExpanded ? (
							<ChevronUp className='h-4 w-4' />
						) : (
							<ChevronDown className='h-4 w-4' />
						)}
					</Button>
				)
			},
		},
		{
			accessorKey: 'refreshed_at',
			header: 'Опублик. время',
			cell: () => '1 мин. назад',
		},
		{
			accessorKey: 'price_value',
			header: 'Цена',
			cell: ({ row }) =>
				Number(row.original.price_value).toLocaleString(),
		},
		{
			accessorKey: 'price_currency',
			header: 'Валюта',
		},
		{
			accessorKey: 'path_km',
			header: 'Путь (км)',
			cell: ({ row }) => `${row.original.path_km} км`,
		},
		{
			accessorKey: 'weight_t',
			header: 'Вес (т)',
		},
		{
			accessorKey: 'origin_city',
			header: 'Точка погрузки',
			cell: ({ row }) =>
				`${row.original.origin_city}, ${row.original.origin_country}`,
		},
		{
			id: 'radius_from',
			header: 'Радиус',
			cell: () => '150',
		},
		{
			accessorKey: 'destination_city',
			header: 'Точка выгрузки',
			cell: ({ row }) =>
				`${row.original.destination_city}, ${row.original.destination_country}`,
		},
		{
			id: 'radius_to',
			header: 'Радиус',
			cell: () => '150',
		},
		{
			accessorKey: 'load_date',
			header: 'Дата',
			cell: ({ row }) =>
				format(new Date(row.original.load_date), 'dd/MM/yyyy', { locale: ru }),
		},
		{
			accessorKey: 'transport_type',
			header: 'Тип',
		},
		{
			accessorKey: 'company_name',
			header: 'Компания',
		},
	]

	return (
		<div className='rounded-xl border bg-white shadow-sm'>
			<DataTable
				columns={columns}
				data={data}
				isLoading={isLoading}
				renderSubComponent={(row) => {
					const cargo = row.original
					const isExpanded = expandedRow === cargo.id
					if (!isExpanded) return null
					return (
						<div className='p-4 bg-muted/30 border-t'>
							<div className='flex justify-between'>
								<div>
									<p className='font-semibold'>Описание:</p>
									<p className='text-sm text-muted-foreground max-w-lg'>
										{cargo.description || 'Нет описания'}
									</p>
								</div>
								<div>
									<p className='font-semibold'>Контакт:</p>
									<p className='text-sm text-muted-foreground'>
										{cargo.contact_value}
									</p>
								</div>
								<Button>Сделать предложение</Button>
							</div>
						</div>
					)
				}}
			/>
		</div>
	)
}
