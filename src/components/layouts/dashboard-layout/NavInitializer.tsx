'use client'

import { useEffect } from 'react'
import { useNavStore, NavItem } from '@/stores/useNavStore'

interface NavInitializerProps {
	items: NavItem[]
}

export function NavInitializer({ items }: NavInitializerProps) {
	const { setItems, clearItems } = useNavStore()

	useEffect(() => {
		setItems(items)

		return () => {
			clearItems()
		}
	}, [items, setItems, clearItems])

	return null
}
