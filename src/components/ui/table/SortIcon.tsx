'use client'

import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'

type SortDirection = 'asc' | 'desc' | false

interface SortIconProps {
	direction: SortDirection
	className?: string
}

export const SortIcon = ({ direction, className }: SortIconProps) => {
	if (direction === 'asc') {
		return <ArrowUp className={className} />
	}

	if (direction === 'desc') {
		return <ArrowDown className={className} />
	}

	return <ArrowUpDown className={className} />
}

