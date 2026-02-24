import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog'
import { Checkbox } from '@/components/ui/Сheckbox'
import type { AgreementTranslator } from '../types/agreementPage.types'

type AgreementTermsSectionProps = {
	isTermsChecked: boolean
	isTermsOpen: boolean
	onTermsCheckedChange: (value: boolean) => void
	onTermsOpenChange: (value: boolean) => void
	t: AgreementTranslator
}

export function AgreementTermsSection({
	isTermsChecked,
	isTermsOpen,
	onTermsCheckedChange,
	onTermsOpenChange,
	t,
}: AgreementTermsSectionProps) {
	return (
		<div className='flex items-start gap-3 text-sm text-muted-foreground'>
			<Checkbox
				id='agreement-terms'
				className='shrink-0'
				checked={isTermsChecked}
				onCheckedChange={(value) => onTermsCheckedChange(Boolean(value))}
			/>
			<label htmlFor='agreement-terms' className='min-w-0 cursor-pointer leading-snug'>
				{t('order.agreement.terms.text')}{' '}
				<Dialog open={isTermsOpen} onOpenChange={onTermsOpenChange}>
					<DialogTrigger asChild>
						<button type='button' className='text-brand underline-offset-4 hover:underline'>
							{t('order.agreement.terms.link')}
						</button>
					</DialogTrigger>
					<DialogContent className='max-w-3xl'>
						<DialogHeader>
							<DialogTitle className='text-center text-2xl font-semibold'>{t('order.agreement.terms.title')}</DialogTitle>
						</DialogHeader>
						<div className='space-y-4 text-sm leading-relaxed text-foreground'>
							<p>{t('order.agreement.terms.intro')}</p>
							<p>{t('order.agreement.terms.delay')}</p>
							<div className='space-y-2'>
								<p className='font-semibold'>{t('order.agreement.terms.responsibility.title')}</p>
								<div className='space-y-2'>
									<p>{t('order.agreement.terms.responsibility.logistic.title')}</p>
									<ul className='list-disc space-y-1 pl-5'>
										<li>{t('order.agreement.terms.responsibility.logistic.item1')}</li>
										<li>{t('order.agreement.terms.responsibility.logistic.item2')}</li>
									</ul>
								</div>
								<div className='space-y-2'>
									<p>{t('order.agreement.terms.responsibility.driver.title')}</p>
									<ul className='list-disc space-y-1 pl-5'>
										<li>{t('order.agreement.terms.responsibility.driver.item1')}</li>
										<li>{t('order.agreement.terms.responsibility.driver.item2')}</li>
										<li>{t('order.agreement.terms.responsibility.driver.item3')}</li>
									</ul>
								</div>
							</div>
							<div className='space-y-2'>
								<p className='font-semibold'>{t('order.agreement.terms.conflicts.title')}</p>
								<p>{t('order.agreement.terms.conflicts.text')}</p>
							</div>
							<div className='space-y-2'>
								<p className='font-semibold'>{t('order.agreement.terms.cancel.title')}</p>
								<ol className='list-decimal space-y-1 pl-5'>
									<li>{t('order.agreement.terms.cancel.item1')}</li>
									<li>{t('order.agreement.terms.cancel.item2')}</li>
								</ol>
							</div>
							<div className='space-y-2'>
								<p className='font-semibold'>{t('order.agreement.terms.force.title')}</p>
								<p>{t('order.agreement.terms.force.text')}</p>
							</div>
							<div className='space-y-2'>
								<p className='font-semibold'>{t('order.agreement.terms.final.title')}</p>
								<p>{t('order.agreement.terms.final.text')}</p>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			</label>
		</div>
	)
}
