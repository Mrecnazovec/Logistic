'use client'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Form } from '@/components/ui/form-control/Form'
import { LanguageSelect } from '@/components/ui/LanguageSelect'
import { PUBLIC_URL } from '@/config/url.config'
import { useI18n } from '@/i18n/I18nProvider'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { AuthFields } from './AuthField'
import { useAuthForm } from './useAuthForm'

export function AuthPage() {
	const { t } = useI18n()
	const { form, isPending, onSubmit } = useAuthForm()
	const searchParams = useSearchParams()
	const nextParam = searchParams.get('next')
	const registerHref = nextParam ? `${PUBLIC_URL.auth('register')}?next=${encodeURIComponent(nextParam)}` : PUBLIC_URL.auth('register')

	return (
		<div className='min-h-screen grid grid-cols-1 lg:grid-cols-2'>
			<h1 className='sr-only'>{t('auth.title')}</h1>
			<div className='bg-[url(/png/bg_auth.png)] h-full flex lg:flex-col items-center justify-center bg-no-repeat bg-cover bg-bottom px-12 min-h-[200px]'>
				<div className='bg-brand-900 rounded-6xl lg:p-12 sm:p-6 p-3'>
					<h2 className='lg:text-[32px] sm:text-xl text-base text-white font-raleway font-semibold'>{t('auth.hero')}</h2>
				</div>
			</div>
			<div className='flex flex-col h-full sm:px-12 px-4 py-8'>
				<div className='flex sm:flex-row flex-col gap-4 items-center lg:justify-end justify-center'>
					<div className='flex items-center justify-center gap-2 flex-wrap'>
						<Link href={registerHref}>
							<Button variant={'outline'} className='bg-accent border-none rounded-full text-[16px] hover:bg-accent/80 px-4 py-3 font-medium'>
								{t('auth.signUp')}
							</Button>
						</Link>
						<LanguageSelect
							triggerClassName='data-[state=open]:[&_svg]:rotate-180 data-[state=open]:[&_svg]:transition-transform data-[state=open]:[&_svg]:duration-200 data-[state=open]:[&_svg]:text-white'
						/>
					</div>
				</div>
				<div className='flex flex-1 items-center justify-center'>
					<Card className='w-full max-w-xl border-none bg-transparent shadow-none'>
						<CardHeader className='mb-6'>
							<h1 className='text-5xl font-bold text-center'>{t('auth.title')}</h1>
						</CardHeader>
						<CardContent>
							<Form {...form}>
								<form onSubmit={form.handleSubmit(onSubmit)}>
									<AuthFields form={form} isPending={isPending} />
									<Button className='w-full'>{t('auth.submit')}</Button>
								</form>
							</Form>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}
