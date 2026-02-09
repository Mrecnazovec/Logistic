'use client'

import { useEditPage } from './hooks/useEditPage'
import { EditFormContent } from './ui/EditFormContent'

type EditPageProps = {
	yandexApiKey?: string
}

export function EditPage({ yandexApiKey }: EditPageProps) {
	const state = useEditPage()
	return <EditFormContent {...state} yandexApiKey={yandexApiKey} />
}
