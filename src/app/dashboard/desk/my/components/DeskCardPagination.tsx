'use client'

import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import {
	buildPaginationItems,
	getPageNumberFromUrl,
	type PaginationItem,
	type ServerPaginationMeta,
} from '@/components/ui/table/DataTable'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

export type DeskCardPaginationState = {
	enabled: boolean
	currentPage: number
	effectiveTotalPages: number
	paginationItems: PaginationItem[]
	canGoPrevious: boolean
	canGoNext: boolean
	goPrevious: () => void
	goNext: () => void
	selectPage: (page: number) => void
}

export function useDeskCardPagination(serverPagination?: ServerPaginationMeta): DeskCardPaginationState {
	const enabled = Boolean(serverPagination)
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const currentPage = Math.max(Number(searchParams.get('page')) || 1, 1)
	const totalCount = serverPagination?.totalCount ?? 0
	const parsedPageSizeParam = Number(searchParams.get('page_size'))
	const pageSizeFromQuery = Number.isFinite(parsedPageSizeParam) && parsedPageSizeParam > 0 ? parsedPageSizeParam : null
	const currentPageItemCount = serverPagination?.pageSize && serverPagination.pageSize > 0 ? serverPagination.pageSize : null
	let resolvedPageSize = currentPageItemCount ?? pageSizeFromQuery ?? 10

	if (
		enabled &&
		!serverPagination?.next &&
		currentPage > 1 &&
		currentPageItemCount &&
		totalCount > currentPageItemCount
	) {
		const inferredPageSize = Math.round((totalCount - currentPageItemCount) / (currentPage - 1))
		if (Number.isFinite(inferredPageSize) && inferredPageSize > 0) {
			resolvedPageSize = inferredPageSize
		}
	}

	const effectiveTotalPages = enabled && totalCount
		? Math.max(Math.ceil(totalCount / resolvedPageSize), currentPage, 1)
		: 1
	const serverNextPage = enabled ? getPageNumberFromUrl(serverPagination?.next) : null
	const serverPreviousPage = enabled
		? getPageNumberFromUrl(serverPagination?.previous) ?? (currentPage > 1 ? currentPage - 1 : null)
		: null
	const canGoPrevious = enabled ? currentPage > 1 || Boolean(serverPagination?.previous) : false
	const canGoNext = enabled ? Boolean(serverPagination?.next) : false
	const paginationItems = useMemo(
		() => buildPaginationItems(effectiveTotalPages, currentPage),
		[currentPage, effectiveTotalPages],
	)

	const goToServerPage = (page: number | null) => {
		if (!enabled || !page || page === currentPage) return

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

	const goPrevious = () => goToServerPage(serverPreviousPage)
	const goNext = () => goToServerPage(serverNextPage ?? currentPage + 1)
	const selectPage = (page: number) => {
		if (page === currentPage) return
		goToServerPage(page)
	}

	return {
		enabled,
		currentPage,
		effectiveTotalPages,
		paginationItems,
		canGoPrevious,
		canGoNext,
		goPrevious,
		goNext,
		selectPage,
	}
}

type CardPaginationControlsProps = {
	pagination: DeskCardPaginationState
	className?: string
}

export function CardPaginationControls({ pagination, className }: CardPaginationControlsProps) {
	if (!pagination.enabled) {
		return null
	}

	const {
		currentPage,
		effectiveTotalPages,
		paginationItems,
		canGoPrevious,
		canGoNext,
		goPrevious,
		goNext,
		selectPage,
	} = pagination

	return (
		<nav
			aria-label='Пагинация заявок'
			className={cn(
				'flex flex-wrap items-center justify-between gap-4 rounded-4xl bg-background px-6 py-4 shadow-sm',
				className,
			)}
		>
			<p className='text-sm text-muted-foreground'>
				Страница {currentPage}
				{Number.isFinite(effectiveTotalPages) ? ` из ${effectiveTotalPages}` : ''}
			</p>

			<div className='flex items-center gap-2'>
				<Button
					variant='ghost'
					size='sm'
					className='h-9 w-9 rounded-full p-0'
					onClick={goPrevious}
					disabled={!canGoPrevious}
					aria-label='Предыдущая страница'
				>
					<ChevronLeft className='size-4' aria-hidden />
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
								onClick={() => selectPage(item)}
								disabled={item === currentPage}
								aria-current={item === currentPage ? 'page' : undefined}
								className={cn(
									'h-9 w-9 rounded-full p-0 text-sm disabled:opacity-100',
									item === currentPage
										? 'bg-brand text-background hover:bg-brand/90'
										: 'text-muted-foreground hover:bg-muted/60',
								)}
							>
								{item}
							</Button>
						),
					)}
				</div>

				<Button
					variant='ghost'
					size='sm'
					className='h-9 w-9 rounded-full p-0'
					onClick={goNext}
					disabled={!canGoNext}
					aria-label='Следующая страница'
				>
					<ChevronRight className='size-4' aria-hidden />
				</Button>
			</div>
		</nav>
	)
}
