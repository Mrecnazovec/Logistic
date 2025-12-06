'use client'

import { memo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/Dialog'
import { RoleEnum } from '@/shared/enums/Role.enum'

export interface IRole {
	key: RoleEnum
	title: string
	icon: React.ElementType
	color: string
	description: string
	buttonText: string
}

interface RegisterRolesProps {
	roles: IRole[]
	onSelect: (role: RoleEnum) => void
}

const RoleDialog = memo(({ role, onSelect }: { role: IRole; onSelect: (r: RoleEnum) => void }) => {
	const [open, setOpen] = useState(false)
	const Icon = role.icon

	const handleSelect = () => {
		onSelect(role.key)
		setOpen(false)
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className='w-full h-14 mb-8'>
					<Icon />
					<p className='sm:flex hidden'>Зарегистрироваться как </p>
					{role.buttonText}
				</Button>
			</DialogTrigger>
			<DialogContent className='gap-0'>
				<DialogTitle className='text-center mb-8 text-2xl font-bold'>Что такое роли?</DialogTitle>
				<div className='flex items-center gap-4 mb-8'>
					<div className='rounded-full p-2.5 bg-brand/40'>
						<Icon color={role.color} />
					</div>
					<p>
						<b>{role.title}</b> — {role.description}
					</p>
				</div>
				<Button onClick={handleSelect} className='w-full h-14'>
					<Icon />
					<p className='sm:flex hidden'>Зарегистрироваться как </p>
					{role.buttonText}
				</Button>
			</DialogContent>
		</Dialog>
	)
})
RoleDialog.displayName = 'RoleDialog'

export const RegisterRoles = ({ roles, onSelect }: RegisterRolesProps) => {
	return (
		<div>
			{roles.map(({ key, title, icon, color, description, buttonText }) => (
				<RoleDialog key={key} role={{ key, title, icon, color, description, buttonText }} onSelect={onSelect} />
			))}
		</div>
	)
}
