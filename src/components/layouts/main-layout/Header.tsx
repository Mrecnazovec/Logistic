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

const SECTION_IDS = ['main', 'info', 'how', 'contacts'] as const

type NavItem = {
	id: typeof SECTION_IDS[number]
	href: `#${typeof SECTION_IDS[number]}`
	label: string
}

type MobileSidebarContentProps = {
	items: NavItem[]
	activeId: NavItem['id']
	onNavigate: (id: NavItem['id']) => void
}

function MobileSidebarContent({ items, activeId, onNavigate }: MobileSidebarContentProps) {
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
							{items.map((item) => (
								<SidebarMenuItem key={item.id}>
									<SidebarMenuButton
										asChild
										onClick={() => {
											onNavigate(item.id)
											handleClose()
										}}
										className={activeId === item.id ? 'text-white' : 'text-white/70'}
									>
										<Link href={item.href}>{item.label}</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
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
	const [activeId, setActiveId] = useState<NavItem['id']>('main')
	const { t } = useI18n()

	const navItems: NavItem[] = [
		{ id: 'main', href: '#main', label: t('header.nav.home') },
		{ id: 'info', href: '#info', label: t('header.nav.info') },
		{ id: 'how', href: '#how', label: t('header.nav.how') },
		{ id: 'contacts', href: '#contacts', label: t('header.nav.contacts') },
	]

	useEffect(() => {
		const handleScroll = () => setHasBackground(window.scrollY > 8)
		handleScroll()
		window.addEventListener('scroll', handleScroll, { passive: true })
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	useEffect(() => {
		const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter((section): section is HTMLElement => Boolean(section))
		if (!sections.length) return

		const observer = new IntersectionObserver(
			(entries) => {
				const activeEntry = entries
					.filter((entry) => entry.isIntersecting)
					.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
				if (activeEntry?.target?.id) {
					setActiveId(activeEntry.target.id as NavItem['id'])
				}
			},
			{
				threshold: [0.1, 0.25, 0.5, 0.75],
				rootMargin: '-20% 0px -60% 0px',
			}
		)

		sections.forEach((section) => observer.observe(section))

		return () => observer.disconnect()
	}, [])

	return (
		<header
			className={`w-full fixed z-50 top-0 transition-colors duration-200 ${hasBackground ? 'bg-[#0c0c0c]/85 backdrop-blur shadow-sm' : 'bg-transparent'
				}`}
		>
			<Container className='p-0 md:py-5 py-0.5 px-5'>
				<nav className='flex items-center w-full relative max-md:justify-between'>
					<Logo href='#main' className='max-md:w-[40px]' />
					<ul className='hidden md:flex flex-1 items-center justify-center lg:gap-15 gap-3 text-white'>
						{navItems.map((item) => (
							<li key={item.id}>
								<Link
									className={`border-b transition-color duration-150 ${activeId === item.id ? 'border-white text-white' : 'border-transparent text-white/80 hover:border-white hover:text-white'
										}`}
									href={item.href}
									onClick={() => setActiveId(item.id)}
								>
									{item.label}
								</Link>
							</li>
						))}
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
						<MobileSidebarContent items={navItems} activeId={activeId} onNavigate={setActiveId} />
					</SidebarProvider>
				</nav>
			</Container>
		</header>
	)
}
