import { Skeleton } from '@/components/ui/Skeleton'
import { TIMELINE_SKELETON_EVENTS_PER_SECTION, TIMELINE_SKELETON_SECTION_COUNT } from '../constants'

export function StatusPageSkeleton() {
	return (
		<div className='grid h-full min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-6'>
			<div className='h-full min-h-[500px] rounded-3xl border p-4'>
				<Skeleton className='h-full w-full rounded-2xl' />
			</div>
			<div className='flex h-full min-h-0 flex-col rounded-3xl border p-4'>
				<div className='flex items-center justify-between'>
					<Skeleton className='h-6 w-24' />
					<Skeleton className='h-6 w-20 rounded-full' />
				</div>
				<div className='mt-6 min-h-0 flex-1 space-y-6 overflow-auto'>
					{Array.from({ length: TIMELINE_SKELETON_SECTION_COUNT }).map((_, sectionIndex) => (
						<section key={sectionIndex} className='space-y-3'>
							<Skeleton className='h-4 w-36' />
							<div className='space-y-3'>
								{Array.from({ length: TIMELINE_SKELETON_EVENTS_PER_SECTION }).map((__, eventIndex) => (
									<Skeleton key={eventIndex} className='h-16 w-full rounded-2xl' />
								))}
							</div>
						</section>
					))}
				</div>
			</div>
		</div>
	)
}
