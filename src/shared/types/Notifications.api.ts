import type { components, operations } from './api'

export type NotificationsListQuery = operations['notifications_list']['parameters']['query']
export type NotificationsMarkReadResponse = components['schemas']['MarkRead']
