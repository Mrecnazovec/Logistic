import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form-control/Form'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/form-control/InputGroup'
import { useI18n } from '@/i18n/I18nProvider'
import { RegisterDto } from '@/shared/types/Registration.interface'
import { Eye, EyeOff, LockKeyhole, User } from 'lucide-react'
import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'

interface RegisterAuthFieldsProps {
	form: UseFormReturn<RegisterDto, undefined>
	isPending: boolean
}

export function RegisterAuthFields({ form, isPending }: RegisterAuthFieldsProps) {
	const { t } = useI18n()
	const [isPasswordVisible, setIsPasswordVisible] = useState(false)
	const [isPasswordRepeatVisible, setIsPasswordRepeatVisible] = useState(false)

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
				rules={{ required: t('register.fields.passwordRequired'), minLength: { value: 8, message: t('register.fields.passwordMin') } }}
				render={({ field }) => (
					<FormItem className='mb-6'>
						<FormLabel className='text-grayscale'>{t('register.fields.passwordLabel')}</FormLabel>
						<FormControl>
							<InputGroup>
								<InputGroupInput
									type={isPasswordVisible ? 'text' : 'password'}
									placeholder={t('register.fields.passwordPlaceholder')}
									disabled={isPending}
									{...field}
									value={field.value ?? ''}
								/>
								<InputGroupAddon className='pr-2'>
									<LockKeyhole className='text-grayscale size-5' />
								</InputGroupAddon>
								<InputGroupAddon align='inline-end' className='pr-2'>
									<InputGroupButton
										type='button'
										variant='ghost'
										size='icon-sm'
										className='text-grayscale hover:text-foreground'
										onClick={() => setIsPasswordVisible((prev) => !prev)}
										aria-label={isPasswordVisible ? t('register.fields.passwordHide') : t('register.fields.passwordShow')}
									>
										{isPasswordVisible ? <EyeOff className='size-5' /> : <Eye className='size-5' />}
									</InputGroupButton>
								</InputGroupAddon>
							</InputGroup>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name='password2'
				rules={{
					required: t('register.fields.passwordRepeatRequired'),
					minLength: { value: 8, message: t('register.fields.passwordMin') },
					validate: (value) => value === form.getValues('password') || t('register.fields.passwordMismatch'),
				}}
				render={({ field }) => (
					<FormItem className='mb-6'>
						<FormLabel className='text-grayscale'>{t('register.fields.passwordRepeatLabel')}</FormLabel>
						<FormControl>
							<InputGroup>
								<InputGroupInput
									type={isPasswordRepeatVisible ? 'text' : 'password'}
									placeholder={t('register.fields.passwordRepeatPlaceholder')}
									disabled={isPending}
									{...field}
									value={field.value ?? ''}
								/>
								<InputGroupAddon className='pr-2'>
									<LockKeyhole className='text-grayscale size-5' />
								</InputGroupAddon>
								<InputGroupAddon align='inline-end' className='pr-2'>
									<InputGroupButton
										type='button'
										variant='ghost'
										size='icon-sm'
										className='text-grayscale hover:text-foreground'
										onClick={() => setIsPasswordRepeatVisible((prev) => !prev)}
										aria-label={isPasswordRepeatVisible ? t('register.fields.passwordHide') : t('register.fields.passwordShow')}
									>
										{isPasswordRepeatVisible ? <EyeOff className='size-5' /> : <Eye className='size-5' />}
									</InputGroupButton>
								</InputGroupAddon>
							</InputGroup>
						</FormControl>
						<FormMessage />

					</FormItem>
				)}
			/>
		</>
	)
}
