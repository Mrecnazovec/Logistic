import { Copy, CopyCheck } from "lucide-react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Button } from "../Button"

export const UuidCell = ({ uuid }: { uuid: string }) => {
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
				throw new Error('Clipboard not supported')
			}
			setCopied(true)
			toast.success('UUID copied to clipboard')
		} catch (error) {
			toast.error('Failed to copy UUID')
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
			<span className='sr-only'>{copied ? 'UUID copied' : 'Copy UUID'}</span>
		</Button>
	)
}