import { Card, CardContent } from '@/components/ui/Card'

type InviteStateCardProps = {
	title: string
	description: string
	icon?: React.ReactNode
	actions?: React.ReactNode
}

export function InviteStateCard({ title, description, icon, actions }: InviteStateCardProps) {
	return (
		<Card className='w-full max-w-xl text-center rounded-3xl shadow-lg border-none'>
			<CardContent className='py-10 flex flex-col items-center gap-4'>
				{icon}
				<div className='space-y-1'>
					<p className='text-xl font-semibold text-foreground'>{title}</p>
					<p className='text-sm text-muted-foreground'>{description}</p>
				</div>
				{actions}
			</CardContent>
		</Card>
	)
}
