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
import React, { useMemo, useState } from 'react'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table/Table'
import { cn } from '@/lib/utils'
import { Button } from '../Button'
import { Input } from '../form-control/Input'

interface ServerPaginationMeta {
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
}

type PaginationItem = number | 'ellipsis'

const getPageNumberFromUrl = (url?: string | null) => {
	if (!url) return null

	try {
		const base = typeof window !== 'undefined' ? window.location.origin : 'http://localhost'
		const parsed = new URL(url, base)
		const pageParam = parsed.searchParams.get('page')
		if (!pageParam) return null

		const page = Number(pageParam)
		return Number.isFinite(page) && page > 0 ? page : null
	} catch {
		return null
	}
}

const buildPaginationItems = (
	totalPages: number,
	currentPage: number,
	siblingCount = 1,
): PaginationItem[] => {
	if (!Number.isFinite(totalPages) || totalPages <= 0) return [1]

	const total = Math.max(Math.floor(totalPages), 1)
	const current = Math.min(Math.max(currentPage, 1), total)

	if (total <= 7) {
		return Array.from({ length: total }, (_, idx) => idx + 1)
	}

	const leftSiblingIndex = Math.max(current - siblingCount, 1)
	const rightSiblingIndex = Math.min(current + siblingCount, total)
	const showLeftEllipsis = leftSiblingIndex > 2
	const showRightEllipsis = rightSiblingIndex < total - 1
	const firstPageIndex = 1
	const lastPageIndex = total
	const range: PaginationItem[] = []
	const edgeItemCount = 2 + siblingCount

	if (!showLeftEllipsis && showRightEllipsis) {
		const leftItemCount = Math.min(edgeItemCount, total)
		for (let i = 1; i <= leftItemCount; i += 1) {
			range.push(i)
		}
		range.push('ellipsis')
		range.push(lastPageIndex)
		return range
	}

	if (showLeftEllipsis && !showRightEllipsis) {
		range.push(firstPageIndex)
		range.push('ellipsis')
		const start = Math.max(total - edgeItemCount + 1, 1)
		for (let i = start; i <= total; i += 1) {
			range.push(i)
		}
		return range
	}

	range.push(firstPageIndex)
	range.push('ellipsis')
	for (let i = leftSiblingIndex; i <= rightSiblingIndex; i += 1) {
		range.push(i)
	}
	range.push('ellipsis')
	range.push(lastPageIndex)

	return range
}
/**
 * Универсальная таблица данных
 * Поддерживает сортировку, фильтрацию, пагинацию и раскрывающиеся строки
 * Можно использовать с любым интерфейсом данных (generic)
 */
export function DataTable<TData, TValue>({
	columns,
	data,
	filterKey,
	renderExpandedRow,
	renderFooterActions,
	isButton = false,
	serverPagination,
	onRowClick,
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
	const paginationItems = useMemo(
		() => buildPaginationItems(effectiveTotalPages, displayPageIndex),
		[displayPageIndex, effectiveTotalPages],
	)
	const canGoPrevious = serverPagination ? canUseServerPrevious : table.getCanPreviousPage()
	const canGoNext = serverPagination ? canUseServerNext : table.getCanNextPage()

	const goToServerPage = (page: number | null) => {
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
	}

	const handlePreviousClick = () => {
		if (serverPagination) {
			goToServerPage(serverPreviousPage)
			return
		}

		table.previousPage()
	}

	const handleNextClick = () => {
		if (serverPagination) {
			goToServerPage(serverNextPage ?? currentPage + 1)
			return
		}

		table.nextPage()
	}

	const handlePageSelect = (page: number) => {
		if (page === displayPageIndex) return

		if (serverPagination) {
			goToServerPage(page)
			return
		}

		table.setPageIndex(page - 1)
	}

	return (
		<div className='rounded-4xl bg-background py-8'>
			{/* 🔍 Фильтр поиска */}
			{filterKey && (
				<div className='flex items-center py-4 max-w-96'>
					<Input
						placeholder='Поиск'
						value={(table.getColumn(filterKey)?.getFilterValue() as string) ?? ''}
						onChange={(event) =>
							table.getColumn(filterKey)?.setFilterValue(event.target.value)
						}
					/>
				</div>
			)}

			{/* 📊 Таблица */}
			<div>
				<Table>
					<TableHeader className='[&_tr]:border-b-0 [&_th]:first:pl-12 [&_th]:py-2'>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
												header.column.columnDef.header,
												header.getContext()
											)}
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
								)}
							>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</TableCell>
										))}
									</TableRow>

									{/* Раскрывающаяся строка */}
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

			{/* 📄 Пагинация и действия */}
			<div className='flex items-center justify-between px-6 py-4 border-t border-border'>
				<p className='text-sm text-muted-foreground'>
					Показано: {table.getPaginationRowModel().rows.length} объявлений
				</p>

				{/* Пагинация */}
				<div className='flex items-center gap-2'>
					<Button
						variant='ghost'
						size='sm'
						className='h-8 w-8 p-0 rounded-full'
						onClick={handlePreviousClick}
						disabled={!canGoPrevious}
						aria-label='Previous page'
					>
						‹
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
									onClick={() => handlePageSelect(item)}
									disabled={item === displayPageIndex}
									aria-current={item === displayPageIndex ? 'page' : undefined}
									className={`h-8 w-8 rounded-full p-0 text-sm disabled:opacity-100 ${item === displayPageIndex
										? 'bg-brand text-white hover:bg-brand/90'
										: 'text-muted-foreground hover:bg-muted/60'
										}`}
								>
									{item}
								</Button>
							),
						)}
					</div>

					<Button
						variant='ghost'
						size='sm'
						className='h-8 w-8 p-0 rounded-full'
						onClick={handleNextClick}
						disabled={!canGoNext}
						aria-label='Next page'
					>
						›
					</Button>
				</div>
				<p className='text-sm text-muted-foreground'>Показано {currentPage} из {paginationItems.length}</p>
				{/* Действия внизу (например, OfferModal) */}
				{renderFooterActions?.(selectedRow)}
			</div>
		</div>
	)
}
