'use client'

import { DASHBOARD_URL } from "@/config/url.config"
import { useRouter } from "next/navigation"
import { useEffect } from "react"


export function Dashboard() {
	const router = useRouter()
	useEffect(() => {
		router.push(DASHBOARD_URL.announcements())
	})
	return <div>Dashboard</div>
}
