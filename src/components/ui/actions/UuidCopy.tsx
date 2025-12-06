import { cn } from "@/lib/utils"
import { Copy, CopyCheck } from "lucide-react"
import { MouseEvent, useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Button } from "../Button"

interface UuidCopy {
	uuid?: string
	id?: number
	isPlaceholder?: boolean
}

export const UuidCopy = ({ uuid, id, isPlaceholder = false }: UuidCopy) => {
	const [copied, setCopied] = useState(false)
	const displayId = uuid || String(id)

	useEffect(() => {
		if (!copied) return

		const timer = window.setTimeout(() => setCopied(false), 2000)
		return () => window.clearTimeout(timer)
	}, [copied])

	const handleCopy = async (event: MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation()

		try {
			if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
				await navigator.clipboard.writeText(displayId)
			} else {
				throw new Error('Буфер обмена не поддерживается')
			}
			setCopied(true)
			toast.success('ID скопировано в буфер обмена')
		} catch (error) {
			toast.error('Ошибка при копировании ID')
		}
	}

	return (
		<Button
			type='button'
			onClick={handleCopy}
			variant='link'
			className='inline-flex min-w-0 max-w-full items-center gap-2 text-left text-sm font-medium text-muted-foreground hover:text-primary focus:outline-none p-0'
		>
			{copied ? (
				<CopyCheck
					className='size-4 shrink-0 text-brand'
					aria-hidden='true'
				/>
			) : (
				<Copy className='size-4 shrink-0' aria-hidden='true' />
			)}
			<span
				className={cn(
					'truncate max-w-[10rem] sm:max-w-[14rem] lg:max-w-[18rem]',
					copied ? 'text-brand' : ''
				)}
			>
				{isPlaceholder && displayId}
			</span>
			<span className='sr-only'>{copied ? 'ID скопировано' : 'Скопировать ID'}</span>
		</Button>
	)
}
