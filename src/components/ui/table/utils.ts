import type { MouseEvent } from 'react'
import type { Column } from '@tanstack/react-table'

export const cycleColumnSort = <TData, TValue>(
	event: MouseEvent<HTMLButtonElement>,
	column: Column<TData, TValue>
) => {
	const isDesc = column.getIsSorted() === 'desc'

	if (isDesc) {
		column.clearSorting()
		return
	}

	const isAsc = column.getIsSorted() === 'asc'
	column.toggleSorting(isAsc, event.shiftKey)
}

