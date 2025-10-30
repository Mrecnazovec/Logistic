'use client'

import { useLayoutEffect } from 'react'
import { useNavStore, NavItem } from '@/stores/useNavStore'

interface NavInitializerProps {
	items: NavItem[]
}

export function NavInitializer({ items }: NavInitializerProps) {
	const { setItems, clearItems } = useNavStore()

	useLayoutEffect(() => {
		setItems(items)

		return () => {
			clearItems()
		}
	}, [items, setItems, clearItems])

	return null
}
