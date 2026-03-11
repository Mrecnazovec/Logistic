import { ProfileLink } from '@/components/ui/actions/ProfileLink'
import { DEFAULT_PLACEHOLDER } from '@/lib/formatters'
import type { SharedOrderSection } from '../types/sharedOrderPage.types'

type SharedOrderParticipantsGridProps = {
	sections: SharedOrderSection[]
}

export function SharedOrderParticipantsGrid({ sections }: SharedOrderParticipantsGridProps) {
	return (
		<div className='grid gap-15 lg:grid-cols-3'>
			{sections.map((section) => (
				<div key={section.title} className='space-y-3'>
					<p className='font-medium text-brand'>{section.title}</p>
					{section.rows.map((row) => (
						<p key={row.label} className='flex justify-between gap-3'>
							<span className='text-grayscale'>{row.label}</span>
							<span className='text-end font-medium'>
								{row.profileId && row.value !== DEFAULT_PLACEHOLDER ? (
									<ProfileLink id={row.profileId} name={row.value} />
								) : (
									row.value
								)}
							</span>
						</p>
					))}
				</div>
			))}
		</div>
	)
}
