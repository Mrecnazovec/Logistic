import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form-control/Form'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/form-control/InputGroup'
import { Checkbox } from '@/components/ui/Сheckbox'
import { PUBLIC_URL } from '@/config/url.config'
import { ILogin } from '@/shared/types/Login.interface'
import { LockKeyhole, Mail } from 'lucide-react'
import Link from 'next/link'
import { UseFormReturn } from 'react-hook-form'

interface AuthFieldsProps {
	form: UseFormReturn<ILogin, undefined>
	isPending: boolean
}

export function AuthFields({ form, isPending }: AuthFieldsProps) {
	return (
		<>
			<FormField
				control={form.control}
				name='login'
				rules={{
					required: 'Почта обязательна',
				}}
				render={({ field }) => (
					<FormItem className='mb-6'>
						<FormLabel className='text-muted-foreground'>Введите почту</FormLabel>
						<FormControl>
							<InputGroup>
								<InputGroupInput placeholder='Введите email' disabled={isPending} {...field} value={field.value ?? ''} />
								<InputGroupAddon className='pr-3'>
									<Mail />
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
					required: 'Пароль обязателен',
				}}
				render={({ field }) => (
					<FormItem className='mb-6'>
						<FormLabel className='text-muted-foreground'>Введите пароль</FormLabel>
						<FormControl>
							<InputGroup>
								<InputGroupInput placeholder='Введите пароль' disabled={isPending} {...field} value={field.value ?? ''} />
								<InputGroupAddon className='pr-3'>
									<LockKeyhole />
								</InputGroupAddon>
							</InputGroup>
						</FormControl>
					</FormItem>
				)}
			/>

			<div className='flex items-center justify-between mb-6'>
				<FormField
					control={form.control}
					name='remember_me'
					render={({ field }) => (
						<FormItem className='flex flex-row items-center space-x-2'>
							<FormControl>
								<Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isPending} />
							</FormControl>
							<FormLabel className='text-sm font-medium leading-none cursor-pointer'>Запомнить меня</FormLabel>
						</FormItem>
					)}
				/>
				<Link href={PUBLIC_URL.auth('forgot')}>Забыли пароль?</Link>
			</div>
		</>
	)
}
