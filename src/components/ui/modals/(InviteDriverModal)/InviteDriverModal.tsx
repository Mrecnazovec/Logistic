'use client'

import type { ComponentProps } from 'react'
import { InviteDriverModalView } from './ui/InviteDriverModalView'

type InviteDriverModalProps = ComponentProps<typeof InviteDriverModalView>

export function InviteDriverModal(props: InviteDriverModalProps) {
	return <InviteDriverModalView {...props} />
}