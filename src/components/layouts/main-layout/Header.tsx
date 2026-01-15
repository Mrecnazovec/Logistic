'use client'

import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { LanguageSelect } from '@/components/ui/LanguageSelect'
import { Logo } from '@/components/ui/Logo'
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	useSidebar,
} from '@/components/ui/Sidebar'
import { useI18n } from '@/i18n/I18nProvider'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

function MobileSidebarContent() {
	const { setOpenMobile } = useSidebar()
	const { t } = useI18n()
	const handleClose = () => setOpenMobile(false)

	return (
		<Sidebar side='right' className='md:hidden'>
			<SidebarContent className='gap-4 p-6'>
				<div className='flex items-center justify-end'>
					<Button type='button' variant='ghost' size='icon' onClick={handleClose} aria-label={t('header.menu.close')}>
						<X className='size-5' />
					</Button>
				</div>
				<SidebarGroup className='p-0'>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton asChild onClick={handleClose}>
									<Link href={'#'}>{t('header.nav.home')}</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton asChild onClick={handleClose}>
									<Link href={'#info'}>{t('header.nav.info')}</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton asChild onClick={handleClose}>
									<Link href={'#how'}>{t('header.nav.how')}</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton asChild onClick={handleClose}>
									<Link href={'#contacts'}>{t('header.nav.contacts')}</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem className='pt-2'>
								<SidebarMenuButton asChild onClick={handleClose}>
									<Link href={'/auth'}>
										<Button className='w-full justify-center'>{t('header.login')}</Button>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem className='pt-2'>
								<div onClick={(event) => event.stopPropagation()}>
									<LanguageSelect
										triggerClassName='w-full justify-between rounded-full border border-white/20 bg-foreground text-white hover:bg-white/20 '
										contentClassName='rounded-2xl'
									/>
								</div>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	)
}

function MobileSidebarTrigger() {
	const { toggleSidebar } = useSidebar()
	const { t } = useI18n()

	return (
		<Button
			type='button'
			variant='ghost'
			size='icon'
			className='ml-auto text-white'
			onClick={toggleSidebar}
			aria-label={t('header.menu.open')}
		>
			<Menu className='size-5' />
		</Button>
	)
}

export function Header() {
	const [hasBackground, setHasBackground] = useState(false)
	const { t } = useI18n()

	useEffect(() => {
		const handleScroll = () => setHasBackground(window.scrollY > 8)
		handleScroll()
		window.addEventListener('scroll', handleScroll, { passive: true })
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	return (
		<header
			className={`w-full fixed z-50 top-0 transition-colors duration-200 ${hasBackground ? 'bg-[#0c0c0c]/85 backdrop-blur shadow-sm' : 'bg-transparent'
				}`}
		>
			<Container className='p-0 md:py-5 py-0.5 px-5'>
				<nav className='flex items-center w-full relative max-md:justify-between'>
					<Logo href='#' className='max-md:w-[40px]' />
					<ul className='hidden md:flex flex-1 items-center justify-center lg:gap-15 gap-3 text-white'>
						<li><Link className='border-b border-transparent hover:border-white transition-color duration-150' href={'#'}>{t('header.nav.home')}</Link></li>
						<li><Link className='border-b border-transparent hover:border-white transition-color duration-150' href={'#info'}>{t('header.nav.info')}</Link></li>
						<li><Link className='border-b border-transparent hover:border-white transition-color duration-150' href={'#how'}>{t('header.nav.how')}</Link></li>
						<li><Link className='border-b border-transparent hover:border-white transition-color duration-150' href={'#contacts'}>{t('header.nav.contacts')}</Link></li>
					</ul>
					<div className='hidden md:flex items-center gap-3 ml-auto'>
						<LanguageSelect
							triggerClassName='border border-white/20 bg-white/10 text-white hover:bg-white/20 data-[state=open]:bg-white/20'
							contentClassName='rounded-2xl'
						/>
						<Link href={'/auth'}>
							<Button>{t('header.login')}</Button>
						</Link>
					</div>
					<SidebarProvider className='min-h-0 w-auto flex-none md:hidden'>
						<MobileSidebarTrigger />
						<MobileSidebarContent />
					</SidebarProvider>
				</nav>
			</Container>
		</header>
	)
}
