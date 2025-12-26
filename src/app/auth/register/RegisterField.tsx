import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form-control/Form'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/form-control/InputGroup'
import { useI18n } from '@/i18n/I18nProvider'
import { RegisterDto } from '@/shared/types/Registration.interface'
import { LockKeyhole, User } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'

interface RegisterAuthFieldsProps {
	form: UseFormReturn<RegisterDto, undefined>
	isPending: boolean
}

export function RegisterAuthFields({ form, isPending }: RegisterAuthFieldsProps) {
	const { t } = useI18n()

	return (
		<>
			<FormField
				control={form.control}
				name='username'
				rules={{ required: t('register.fields.loginRequired') }}
				render={({ field }) => (
					<FormItem className='mb-6'>
						<FormLabel className='text-grayscale'>{t('register.fields.loginLabel')}</FormLabel>
						<FormControl>
							<InputGroup>
								<InputGroupInput
									placeholder={t('register.fields.loginPlaceholder')}
									disabled={isPending}
									{...field}
									value={field.value ?? ''}
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
				rules={{ required: t('register.fields.passwordRequired') }}
				render={({ field }) => (
					<FormItem className='mb-6'>
						<FormLabel className='text-grayscale'>{t('register.fields.passwordLabel')}</FormLabel>
						<FormControl>
							<InputGroup>
								<InputGroupInput
									type='password'
									placeholder={t('register.fields.passwordPlaceholder')}
									disabled={isPending}
									{...field}
									value={field.value ?? ''}
								/>
								<InputGroupAddon className='pr-2'>
									<LockKeyhole className='text-grayscale size-5' />
								</InputGroupAddon>
							</InputGroup>
						</FormControl>
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name='password2'
				rules={{ required: t('register.fields.passwordRepeatRequired') }}
				render={({ field }) => (
					<FormItem className='mb-6'>
						<FormLabel className='text-grayscale'>{t('register.fields.passwordRepeatLabel')}</FormLabel>
						<FormControl>
							<InputGroup>
								<InputGroupInput
									type='password'
									placeholder={t('register.fields.passwordRepeatPlaceholder')}
									disabled={isPending}
									{...field}
									value={field.value ?? ''}
								/>
								<InputGroupAddon className='pr-2'>
									<LockKeyhole className='text-grayscale size-5' />
								</InputGroupAddon>
							</InputGroup>
						</FormControl>
					</FormItem>
				)}
			/>
		</>
	)
}
