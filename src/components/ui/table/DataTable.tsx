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
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useMemo, useState } from 'react'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table/Table'
import { buildPaginationItems, getPageNumberFromUrl, PaginationItem } from '@/lib/pagination'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../Button'
import { Input } from '../form-control/Input'

export interface ServerPaginationMeta {
	next?: string | null
	previous?: string | null
	totalCount?: number
	pageSize?: number
}

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	filterKey?: string
	isButton?: boolean
	renderExpandedRow?: (row: TData) => React.ReactNode
	renderFooterActions?: (selectedRow?: TData) => React.ReactNode
	serverPagination?: ServerPaginationMeta
	onRowClick?: (record: TData) => void
	rowClassName?: (record: TData) => string | undefined
}

export function DataTable<TData, TValue>({
	columns,
	data,
	filterKey,
	renderExpandedRow,
	renderFooterActions,
	isButton = false,
	serverPagination,
	onRowClick,
	rowClassName,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [rowSelection, setRowSelection] = useState({})
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	})
	const [expandedRow, setExpandedRow] = useState<string | null>(null)
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	// eslint-disable-next-line react-hooks/incompatible-library
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

	const selectedRow = table.getFilteredSelectedRowModel().rows[0]?.original
	const currentPage = Math.max(Number(searchParams.get('page')) || 1, 1)
	const serverNextPage = serverPagination ? getPageNumberFromUrl(serverPagination.next) : null
	const serverPreviousPage = serverPagination
		? getPageNumberFromUrl(serverPagination.previous) ?? (currentPage > 1 ? currentPage - 1 : null)
		: null
	const canUseServerPrevious = serverPagination ? currentPage > 1 || Boolean(serverPagination.previous) : false
	const canUseServerNext = serverPagination ? Boolean(serverPagination.next) : false
	const effectiveTotalPages =
		serverPagination?.totalCount && (serverPagination.pageSize ?? pagination.pageSize)
			? Math.max(
				Math.ceil(serverPagination.totalCount / (serverPagination.pageSize ?? pagination.pageSize)),
				1,
			)
			: Math.max(table.getPageCount(), 1)
	const displayPageIndex = serverPagination ? currentPage : table.getState().pagination.pageIndex + 1
	const paginationItems = useMemo<PaginationItem[]>(
		() => buildPaginationItems(effectiveTotalPages, displayPageIndex),
		[displayPageIndex, effectiveTotalPages],
	)
	const canGoPrevious = serverPagination ? canUseServerPrevious : table.getCanPreviousPage()
	const canGoNext = serverPagination ? canUseServerNext : table.getCanNextPage()
	const containerClassName = cn('rounded-4xl bg-background py-8', isButton && 'shadow-sm')

	const navigateToPage = useCallback(
		(page: number | null) => {
			if (!serverPagination || !page || page === currentPage) return

			const params = new URLSearchParams(searchParams.toString())

			if (page <= 1) {
				params.delete('page')
			} else {
				params.set('page', page.toString())
			}

			const queryString = params.toString()
			const nextRoute = queryString ? `${pathname}?${queryString}` : pathname

			router.push(nextRoute)
		},
		[currentPage, pathname, router, searchParams, serverPagination],
	)

	const handlePageChange = useCallback(
		(target: 'previous' | 'next' | number) => {
			if (serverPagination) {
				const targetPage =
					typeof target === 'number'
						? target
						: target === 'previous'
							? serverPreviousPage
							: serverNextPage ?? currentPage + 1

				navigateToPage(targetPage)
				return
			}

			if (typeof target === 'number') {
				table.setPageIndex(target - 1)
				return
			}

			if (target === 'previous') {
				table.previousPage()
			} else {
				table.nextPage()
			}
		},
		[currentPage, navigateToPage, serverNextPage, serverPagination, serverPreviousPage, table],
	)

	const footerActions = renderFooterActions?.(selectedRow)

	return (
		<div className={containerClassName}>
			{filterKey && (
				<div className='flex items-center py-4 max-w-96'>
					<Input
						placeholder='Search'
						value={(table.getColumn(filterKey)?.getFilterValue() as string) ?? ''}
						onChange={(event) => table.getColumn(filterKey)?.setFilterValue(event.target.value)}
					/>
				</div>
			)}

			<div>
				<Table>
					<TableHeader className='[&_tr]:border-b-0 [&_th]:first:pl-12 [&_th]:py-2'>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(header.column.columnDef.header, header.getContext())}
									</TableHead>
								))}
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
											if (onRowClick) {
												onRowClick(row.original)
												return
											}

											if (renderExpandedRow) {
												setExpandedRow(expandedRow === row.id ? null : row.id)
											}
										}}
										className={cn(
											(renderExpandedRow || onRowClick) &&
											'cursor-pointer hover:bg-muted/40 transition-colors',
											rowClassName?.(row.original),
										)}
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
									No data available.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<div className='flex items-center justify-between px-6 py-4 border-t border-border'>
				<p className='text-sm text-muted-foreground'>
					Показано: {table.getPaginationRowModel().rows.length} элементов
				</p>

				<div className='flex items-center gap-2'>
					<Button
						variant='ghost'
						size='sm'
						className='h-8 w-8 p-0 rounded-full'
						onClick={() => handlePageChange('previous')}
						disabled={!canGoPrevious}
						aria-label='Previous page'
					>
						<ChevronLeft />
					</Button>

					<div className='flex items-center gap-1'>
						{paginationItems.map((item, index) =>
							item === 'ellipsis' ? (
								<span key={`ellipsis-${index}`} className='px-2 text-sm text-muted-foreground'>
									...
								</span>
							) : (
								<Button
									key={`page-${item}`}
									variant='ghost'
									size='sm'
									onClick={() => handlePageChange(item)}
									disabled={item === displayPageIndex}
									aria-current={item === displayPageIndex ? 'page' : undefined}
									className={cn(
										'h-8 w-8 rounded-full p-0 text-sm disabled:opacity-100',
										item === displayPageIndex
											? 'bg-brand text-white hover:bg-brand/90'
											: 'text-muted-foreground hover:bg-muted/60',
									)}
								>
									{item}
								</Button>
							)
						)}
					</div>

					<Button
						variant='ghost'
						size='sm'
						className='h-8 w-8 p-0 rounded-full'
						onClick={() => handlePageChange('next')}
						disabled={!canGoNext}
						aria-label='Next page'
					>
						<ChevronRight />
					</Button>
				</div>
				<p className='text-sm text-muted-foreground'>
					Страница {displayPageIndex} из {effectiveTotalPages}
				</p>
				{footerActions}
			</div>
		</div>
	)
}
