import { DASHBOARD_URL } from "@/config/url.config";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Props {
	id: string
	name: string
	className: string
}

export function ProfileLink({ id, name, className }: Props) {
	return <Link className={cn('', className)} href={DASHBOARD_URL.profile(id)}>{name}</Link>
}
