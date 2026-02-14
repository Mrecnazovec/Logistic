'use client'

import { useEditPage } from './hooks/useEditPage'
import { EditFormContent } from './ui/EditFormContent'

type EditPageProps = {
	yandexApiKey?: string
	showMap?: boolean
}

export function EditPage({ yandexApiKey, showMap = true }: EditPageProps) {
	const state = useEditPage()
	return <EditFormContent {...state} yandexApiKey={yandexApiKey} showMap={showMap} />
}
