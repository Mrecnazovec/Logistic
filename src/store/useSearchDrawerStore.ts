'use client'

import { create } from 'zustand'

type SearchDrawerStore = {
	isOpen: boolean
	setOpen: (open: boolean) => void
	open: () => void
	close: () => void
}

export const useSearchDrawerStore = create<SearchDrawerStore>((set) => ({
	isOpen: false,
	setOpen: (open) => set({ isOpen: open }),
	open: () => set({ isOpen: true }),
	close: () => set({ isOpen: false }),
}))
