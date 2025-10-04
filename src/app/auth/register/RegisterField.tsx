import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form-control/Form'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/form-control/InputGroup'
import { RegisterDto } from '@/shared/types/Registration.interface'
import { LockKeyhole, Mail, User, Phone } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'

interface RegisterFieldsProps {
	form: UseFormReturn<RegisterDto, undefined>
	isPending: boolean
}

export function RegisterFields({ form, isPending }: RegisterFieldsProps) {
	return (
		<>
			{/* Email */}
			<FormField
				control={form.control}
				name='email'
				rules={{ required: 'Почта обязательна' }}
				render={({ field }) => (
					<FormItem className='mb-6'>
						<FormLabel className='text-grayscale'>Введите почту</FormLabel>
						<FormControl>
							<InputGroup>
								<InputGroupInput placeholder='Введите email' disabled={isPending} {...field} value={field.value ?? ''} />
								<InputGroupAddon className='pr-2'>
									<Mail className='text-grayscale size-5' />
								</InputGroupAddon>
							</InputGroup>
						</FormControl>
					</FormItem>
				)}
			/>

			{/* Пароль */}
			<FormField
				control={form.control}
				name='password'
				rules={{ required: 'Пароль обязателен' }}
				render={({ field }) => (
					<FormItem className='mb-6'>
						<FormLabel className='text-grayscale'>Введите пароль</FormLabel>
						<FormControl>
							<InputGroup>
								<InputGroupInput type='password' placeholder='Введите пароль' disabled={isPending} {...field} value={field.value ?? ''} />
								<InputGroupAddon className='pr-2'>
									<LockKeyhole className='text-grayscale size-5' />
								</InputGroupAddon>
							</InputGroup>
						</FormControl>
					</FormItem>
				)}
			/>

			{/* Повтор пароля */}
			<FormField
				control={form.control}
				name='password2'
				rules={{ required: 'Подтвердите пароль' }}
				render={({ field }) => (
					<FormItem className='mb-6'>
						<FormLabel className='text-grayscale'>Подтвердите пароль</FormLabel>
						<FormControl>
							<InputGroup>
								<InputGroupInput type='password' placeholder='Повторите пароль' disabled={isPending} {...field} value={field.value ?? ''} />
								<InputGroupAddon className='pr-2'>
									<LockKeyhole className='text-grayscale size-5' />
								</InputGroupAddon>
							</InputGroup>
						</FormControl>
					</FormItem>
				)}
			/>

			{/* Телефон */}
			<FormField
				control={form.control}
				name='phone'
				rules={{ required: 'Телефон обязателен' }}
				render={({ field }) => (
					<FormItem className='mb-6'>
						<FormLabel className='text-grayscale'>Введите телефон</FormLabel>
						<FormControl>
							<InputGroup>
								<InputGroupInput placeholder='+998 ...' disabled={isPending} {...field} value={field.value ?? ''} />
								<InputGroupAddon className='pr-2'>
									<Phone className='text-grayscale size-5' />
								</InputGroupAddon>
							</InputGroup>
						</FormControl>
					</FormItem>
				)}
			/>
		</>
	)
}
