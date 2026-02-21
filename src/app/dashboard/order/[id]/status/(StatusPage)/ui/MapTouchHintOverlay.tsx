'use client'

type MapTouchHintOverlayProps = {
	label: string
	onDismiss: () => void
}

export function MapTouchHintOverlay({ label, onDismiss }: MapTouchHintOverlayProps) {
	return (
		<button
			type='button'
			onClick={onDismiss}
			className='absolute inset-0 z-20 grid place-items-center bg-background/10 backdrop-blur-[1px]'
			aria-label={label}
		>
			<span className='rounded-full bg-background/95 px-4 py-2 text-sm font-medium text-foreground shadow-sm'>{label}</span>
		</button>
	)
}

