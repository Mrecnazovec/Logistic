import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AgreementRealtimeStore = {
	hasAgreementUpdates: boolean
	markAgreementUpdate: () => void
	clearAgreementUpdate: () => void
}

export const useAgreementRealtimeStore = create<AgreementRealtimeStore>()(
	persist(
		(set) => ({
			hasAgreementUpdates: false,
			markAgreementUpdate: () => set({ hasAgreementUpdates: true }),
			clearAgreementUpdate: () => set({ hasAgreementUpdates: false }),
		}),
		{
			name: 'agreement-unread-store',
		},
	),
)
