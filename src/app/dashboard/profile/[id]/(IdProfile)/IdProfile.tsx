'use client'

import { useIdProfilePage } from './hooks/useIdProfilePage'
import { IdProfileView } from './ui/IdProfileView'

export function IdProfile() {
	const state = useIdProfilePage()
	return <IdProfileView {...state} />
}
