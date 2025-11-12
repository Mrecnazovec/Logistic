'use client'

import { create } from 'zustand'

export type TableType = 'card' | 'table'

type TableTypeStore = {
	tableType: TableType
	setTableType: (tableType: TableType) => void
}

export const useTableTypeStore = create<TableTypeStore>((set) => ({
	tableType: 'table',
	setTableType: (tableType) => set({ tableType }),
}))

