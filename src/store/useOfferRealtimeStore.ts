import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type OfferUnreadTarget = 'desk' | 'myOffers'

export type OfferUnreadItem = {
	offerId: number
	cargoId: number
	target: OfferUnreadTarget
}

type OfferRealtimeStore = {
	unreadOffers: OfferUnreadItem[]
	addOffer: (item: OfferUnreadItem) => void
	clearOffer: (offerId: number) => void
	clearCargo: (cargoId: number) => void
	resetOffers: () => void
}

export const useOfferRealtimeStore = create<OfferRealtimeStore>()(
	persist(
		(set) => ({
			unreadOffers: [],
			addOffer: (item) =>
				set((state) => {
					const existing = state.unreadOffers.find((entry) => entry.offerId === item.offerId)
					if (existing) {
						if (existing.cargoId === item.cargoId && existing.target === item.target) return state
						return {
							unreadOffers: state.unreadOffers.map((entry) =>
								entry.offerId === item.offerId ? item : entry
							),
						}
					}
					return { unreadOffers: [...state.unreadOffers, item] }
				}),
			clearOffer: (offerId) =>
				set((state) => ({
					unreadOffers: state.unreadOffers.filter((entry) => entry.offerId !== offerId),
				})),
			clearCargo: (cargoId) =>
				set((state) => ({
					unreadOffers: state.unreadOffers.filter((entry) => entry.cargoId !== cargoId),
				})),
			resetOffers: () => set({ unreadOffers: [] }),
		}),
		{
			name: 'offer-unread-store',
		},
	),
)
