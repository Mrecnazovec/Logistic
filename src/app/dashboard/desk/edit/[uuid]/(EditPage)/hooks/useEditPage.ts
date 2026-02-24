"use client"

import { useGetLoad } from '@/hooks/queries/loads/useGet/useGetLoad'
import { useGetMe } from '@/hooks/queries/me/useGetMe'
import { useEffect } from 'react'
import { createCityFromValues, formatCityLabel } from '../lib/city'
import { useEditForm } from './useEditForm'

export function useEditPage() {
	const { form, isLoadingPatch, onSubmit } = useEditForm()
	const { load } = useGetLoad()
	const { me } = useGetMe()

	const originCityValue = form.watch('origin_city')
	const originCountryValue = form.watch('origin_country')
	const destinationCityValue = form.watch('destination_city')
	const destinationCountryValue = form.watch('destination_country')

	const originCityLabel = formatCityLabel(createCityFromValues(originCityValue, originCountryValue))
	const destinationCityLabel = formatCityLabel(createCityFromValues(destinationCityValue, destinationCountryValue))

	useEffect(() => {
		if (!load) return

		const weightKg = Number(load.weight_kg ?? 0)
		const weight_tons = Number.isFinite(weightKg) ? weightKg / 1000 : 0

		form.reset({
			origin_city: load.origin_city ?? '',
			origin_country: load.origin_country ?? '',
			origin_address: load.origin_address ?? '',
			origin_lat: load.origin_lat ?? undefined,
			origin_lng: load.origin_lng ?? undefined,
			destination_city: load.destination_city ?? '',
			destination_country: load.destination_country ?? '',
			destination_address: load.destination_address ?? '',
			dest_lat: load.dest_lat ?? undefined,
			dest_lng: load.dest_lng ?? undefined,
			load_date: load.load_date ?? '',
			delivery_date: load.delivery_date ?? '',
			price_currency: load.price_currency ?? undefined,
			price_value: load.price_value ?? '',
			product: load.product ?? '',
			transport_type: load.transport_type ?? '',
			contact_pref: load.contact_pref ?? '',
			description: load.description ?? '',
			axles: load.axles ?? null,
			volume_m3: load.volume_m3 ?? '',
			payment_method: load.payment_method ?? '',
			weight_kg: load.weight_kg ?? '',
			weight_tons: weight_tons ?? '',
			is_hidden: Boolean(load.is_hidden),
		})
	}, [load, form])

	return {
		form,
		isLoadingPatch,
		onSubmit,
		load,
		me,
		originCountryValue,
		destinationCountryValue,
		originCityLabel,
		destinationCityLabel,
	}
}
