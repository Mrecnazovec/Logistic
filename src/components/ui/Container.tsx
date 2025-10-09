import { cn } from '@/lib/utils'
import { PropsWithChildren } from 'react'

interface IContainer {
	className?: string
}

export function Container({ className, children }: PropsWithChildren<IContainer>) {
	return <div className={cn('container mx-auto p-5', className)}>{children}</div>
}
