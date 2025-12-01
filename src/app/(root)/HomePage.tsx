'use client'

import { DASHBOARD_URL } from "@/config/url.config"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function HomePage() {
	const router = useRouter()
	useEffect(() => {
		router.push(DASHBOARD_URL.announcements())
	}, [router])
	return <div>HomePage123</div>
}
