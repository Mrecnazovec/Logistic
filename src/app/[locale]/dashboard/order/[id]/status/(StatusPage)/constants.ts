export const EN_LOCALE = 'en-US'
export const DEFAULT_LOCALE = 'ru-RU'

export const TIMELINE_SKELETON_SECTION_COUNT = 3
export const TIMELINE_SKELETON_EVENTS_PER_SECTION = 2

export const DEFAULT_POINT: [number, number] = [41.3111, 69.2797]
export const STATIC_DRIVER_POINT: [number, number] = [42.8848, 74.6111]

const TRUCK_ICON_SVG =
	'<svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42"><circle cx="21" cy="21" r="21" fill="#1d4ed8"/><path d="M11 23h2a3 3 0 1 0 6 0h4a3 3 0 1 0 6 0h2v-7l-3-4h-7v2h6l1.7 2.3H23V23h-2a3 3 0 1 0-6 0h-4v-8h10v-3H9v11h2zm5 2a1.4 1.4 0 1 1 0-2.8 1.4 1.4 0 0 1 0 2.8zm10 0a1.4 1.4 0 1 1 0-2.8 1.4 1.4 0 0 1 0 2.8z" fill="#fff"/></svg>'

export const TRUCK_ICON_URL = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(TRUCK_ICON_SVG)}`

export const DRIVER_ROUTE_STYLES = {
	activeStrokeColor: '#2563eb',
	activeStrokeWidth: 5,
	activeStrokeOpacity: 0.9,
	strokeColor: '#2563eb',
	strokeWidth: 4,
	strokeOpacity: 0.85,
} as const
