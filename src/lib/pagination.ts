export type PaginationItem = number | 'ellipsis'

export const getPageNumberFromUrl = (url?: string | null): number | null => {
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

export const buildPaginationItems = (
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
