'use client'

import { useEditPage } from './hooks/useEditPage'
import { EditFormContent } from './ui/EditFormContent'

export function EditPage() {
	const state = useEditPage()
	return <EditFormContent {...state} />
}
