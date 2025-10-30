import { create } from 'zustand'

export interface NavItem {
	label: string
	href: string
	active?: boolean
}

interface NavState {
	items: NavItem[]
	setItems: (items: NavItem[]) => void
	clearItems: () => void
}

export const useNavStore = create<NavState>((set) => ({
	items: [],
	setItems: (items) => set({ items }),
	clearItems: () => set({ items: [] }),
}))
