import { DASHBOARD_URL } from "@/config/url.config";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Props {
	id: number
	name: string
	className?: string
}

export function ProfileLink({ id, name, className }: Props) {
	return <Link className={cn('text-brand hover:text-brand/80 font-semibold', className)} href={DASHBOARD_URL.profile(String(id))}>{name}</Link>
}
