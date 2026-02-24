import { useMediaQuery } from './useMediaQuery'

const DEFAULT_MOBILE_MAX_WIDTH = 767

export function useIsMobile(maxWidth = DEFAULT_MOBILE_MAX_WIDTH) {
	return useMediaQuery(`(max-width: ${maxWidth}px)`)
}
