import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form-control/Form'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/form-control/InputGroup'
import { Checkbox } from '@/components/ui/Сheckbox'
import { PUBLIC_URL } from '@/config/url.config'
import { useI18n } from '@/i18n/I18nProvider'
import { ILogin } from '@/shared/types/Login.interface'
import { LockKeyhole, User } from 'lucide-react'
import Link from 'next/link'
import { UseFormReturn } from 'react-hook-form'

interface AuthFieldsProps {
	form: UseFormReturn<ILogin, undefined>
	isPending: boolean
}

export function AuthFields({ form, isPending }: AuthFieldsProps) {
	const { t } = useI18n()

	return (
		<>
			<FormField
				control={form.control}
				name='login'
				rules={{
					required: t('auth.fields.loginRequired'),
				}}
				render={({ field }) => (
					<FormItem className='mb-6'>
						<FormLabel className='text-grayscale'>{t('auth.fields.loginLabel')}</FormLabel>
						<FormControl>
							<InputGroup>
								<InputGroupInput
									placeholder={t('auth.fields.loginLabel')}
									disabled={isPending}
									{...field}
									value={field.value ?? ''}
									autoComplete='login'
								/>
								<InputGroupAddon className='pr-2'>
									<User className='text-grayscale size-5' />
								</InputGroupAddon>
							</InputGroup>
						</FormControl>
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name='password'
				rules={{
					required: t('auth.fields.passwordRequired'),
				}}
				render={({ field }) => (
					<FormItem className='mb-6'>
						<FormLabel className='text-grayscale'>{t('auth.fields.passwordLabel')}</FormLabel>
						<FormControl>
							<InputGroup>
								<InputGroupInput
									placeholder={t('auth.fields.passwordPlaceholder')}
									type='password'
									disabled={isPending}
									{...field}
									value={field.value ?? ''}
									autoComplete='current-password'
								/>
								<InputGroupAddon className='pr-2'>
									<LockKeyhole className='text-grayscale size-5' />
								</InputGroupAddon>
							</InputGroup>
						</FormControl>
					</FormItem>
				)}
			/>

			<div className='flex items-center gap-4 justify-between flex-wrap mb-6'>
				<FormField
					control={form.control}
					name='remember_me'
					render={({ field }) => (
						<FormItem className='flex flex-row items-center space-x-2'>
							<FormControl>
								<Checkbox className='rounded-full ' checked={field.value ?? false} onCheckedChange={field.onChange} disabled={isPending} />
							</FormControl>
							<FormLabel className='text-sm font-medium leading-none cursor-pointer'>{t('auth.fields.rememberMe')}</FormLabel>
						</FormItem>
					)}
				/>
				<Link className='text-brand text-base font-medium' href={PUBLIC_URL.auth('forgot-password')}>
					{t('auth.fields.forgotPassword')}
				</Link>
			</div>
		</>
	)
}
