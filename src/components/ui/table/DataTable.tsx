'use client'

import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	PaginationState,
	SortingState,
	useReactTable,
} from '@tanstack/react-table'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table/Table'
import React, { useState } from 'react'

import { Button } from '../Button'
import { Input } from '../form-control/Input'
import { ExpandedCargoRow } from '@/app/dashboard/announcements/table/ExpandedCargoRow'
import { OfferModal } from '../modals/OfferModal'
import { ICargoList } from '@/shared/types/CargoList.interface'

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	filterKey?: string
	renderExpandedRow?: (row: TData) => React.ReactNode
}

export function DataTable<TData, TValue>({ columns, data, filterKey, renderExpandedRow }: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

	const [rowSelection, setRowSelection] = useState({})

	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 9,
	})

	const [expandedRow, setExpandedRow] = useState<string | null>(null)

	const table = useReactTable({
		data,
		columns,
		state: { sorting, columnFilters, rowSelection, pagination },
		onPaginationChange: setPagination,
		onRowSelectionChange: setRowSelection,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
	})

	console.log(table.getFilteredSelectedRowModel().rows);


	return (
		<div className='rounded-4xl bg-background py-8 h-full'>
			{filterKey && (
				<div className='flex items-center py-4 max-w-96'>
					<Input
						placeholder='Поиск'
						value={(table.getColumn(filterKey)?.getFilterValue() as string) ?? ''}
						onChange={(event) => table.getColumn(filterKey)?.setFilterValue(event.target.value)}
						className=''
					/>
				</div>
			)}
			<div>
				<Table>
					<TableHeader className='[&_tr]:border-b-0 [&_th]:first:pl-12 [&_th]:py-2'>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead className='' key={header.id}>
											{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody className='[&_tr]:border-b-0 [&_td]:first:pl-12 [&_td]:py-5'>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<React.Fragment key={row.id}>
									<TableRow
										data-state={row.getIsSelected() && 'selected'}
										onClick={() => {
											if (renderExpandedRow) {
												setExpandedRow(expandedRow === row.id ? null : row.id)
											}
										}}
										className={renderExpandedRow ? 'cursor-pointer hover:bg-muted/40 transition-colors' : ''}
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</TableCell>
										))}
									</TableRow>

									{renderExpandedRow && expandedRow === row.id && (
										<TableRow className='bg-muted/20'>
											<TableCell colSpan={columns.length} className='py-6 px-12'>
												{renderExpandedRow(row.original)}
											</TableCell>
										</TableRow>
									)}
								</React.Fragment>


							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className='h-24 text-center'>
									Ничего не найдено.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className='flex items-center justify-between px-6 py-4 border-t border-border'>
				<p className='text-sm text-muted-foreground'>
					Показано: {table.getPaginationRowModel().rows.length} объявлений
				</p>

				<div className='flex items-center gap-2'>
					<Button
						variant='ghost'
						size='sm'
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						‹
					</Button>
					<span className='text-sm'>
						{table.getState().pagination.pageIndex + 1} из {table.getPageCount()}
					</span>
					<Button
						variant='ghost'
						size='sm'
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						›
					</Button>
				</div>

				<OfferModal selectedRows={table.getFilteredSelectedRowModel().rows.map(row => row.original as ICargoList)} />
			</div>
		</div>
	)
}
