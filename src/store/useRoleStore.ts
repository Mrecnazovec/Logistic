import { create } from 'zustand'

import type { RoleEnum } from '@/shared/enums/Role.enum'

type RoleStore = {
	role?: RoleEnum
	setRole: (role?: RoleEnum) => void
}

export const useRoleStore = create<RoleStore>((set) => ({
	role: undefined,
	setRole: (role) =>
		set((state) => {
			if (state.role === role) return state
			return { role }
		}),
}))
