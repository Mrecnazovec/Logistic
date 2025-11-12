import { Copy, CopyCheck } from "lucide-react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Button } from "../Button"

interface UuidCopy {
	uuid: string
	isPlaceholder?: boolean
}

export const UuidCopy = ({ uuid, isPlaceholder = false }: UuidCopy) => {
	const [copied, setCopied] = useState(false)

	useEffect(() => {
		if (!copied) return

		const timer = window.setTimeout(() => setCopied(false), 2000)
		return () => window.clearTimeout(timer)
	}, [copied])

	const handleCopy = async () => {
		try {
			if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
				await navigator.clipboard.writeText(uuid)
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
			className='inline-flex items-center gap-2 text-left text-sm font-medium text-muted-foreground hover:text-primary focus:outline-none p-0'
		>
			{copied ? (
				<CopyCheck
					className='size-4 shrink-0 text-brand'
					aria-hidden='true'
				/>
			) : (
				<Copy className='size-4 shrink-0' aria-hidden='true' />
			)}
			<span className={copied ? 'text-brand' : ''}>{isPlaceholder && uuid}</span>
			<span className='sr-only'>{copied ? 'ID скопировано' : 'Скопировать ID'}</span>
		</Button>
	)
}