import { Button } from '@/components/ui/Button'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/Select'
import { IMG_URL } from '@/config/url.config'
import { SelectValue } from '@radix-ui/react-select'
import Image from 'next/image'

export function AuthPage() {
	return (
		<div className='min-h-screen grid grid-cols-1 lg:grid-cols-2'>
			<h1 className='sr-only'>Авторизация</h1>
			<div className='bg-[url(/png/bg_auth.png)] h-full hidden lg:flex lg:flex-col items-center justify-center bg-no-repeat bg-cover bg-center px-12'>
				<div className='bg-brand rounded-6xl p-12'>
					<h2 className='text-[32px] text-white font-raleway font-semibold'>
						Высококачественное программное решение для управления вашим бизнес-процессом
					</h2>
				</div>
			</div>
			<div className='flex flex-col h-full px-12 py-8'>
				<div className='flex gap-2 self-end'>
					<Button variant={'outline'} className='bg-accent border-none rounded-full text-[16px] hover:bg-accent/80 px-4 py-3 font-medium'>
						Зарегистрироваться
					</Button>
					<Select>
						<SelectTrigger
							className='bg-accent border-none rounded-full text-[16px] hover:bg-accent/80 data-[placeholder]:text-primary text-primary font-medium data-[placeholder]:font-medium px-4 py-3 data-[state=open]:bg-brand data-[state=open]:text-white transition-all
'
							aria-label='Выберите язык'
						>
							<SelectValue placeholder='Выберите язык' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='UZB'>
								<div className='flex items-center gap-2.5 font-medium'>
									<Image className='rounded-full' src={IMG_URL.svg('uzb')} width={24} height={24} alt='' /> Узбекский
								</div>
							</SelectItem>
							<SelectItem value='RUS'>
								<div className='flex items-center gap-2.5 font-medium'>
									<Image className='rounded-full' src={IMG_URL.svg('rus')} width={24} height={24} alt='' /> Русский
								</div>
							</SelectItem>
							<SelectItem value='ENG'>
								<div className='flex items-center gap-2.5 font-medium'>
									<Image className='rounded-full' src={IMG_URL.svg('eng')} width={24} height={24} alt='' /> Английский
								</div>
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
		</div>
	)
}
