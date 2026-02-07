'use client'

import type { ComponentProps } from 'react'
import { DeskInviteModalView } from './ui/DeskInviteModalView'

type DeskInviteModalProps = ComponentProps<typeof DeskInviteModalView>

export function DeskInviteModal(props: DeskInviteModalProps) {
	return <DeskInviteModalView {...props} />
}