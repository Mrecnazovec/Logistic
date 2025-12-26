import type { Locale } from '../config'
import authEn from '@/app/auth/locale/en'
import authRu from '@/app/auth/locale/ru'
import announcementsEn from '@/app/dashboard/announcements/locale/en'
import announcementsRu from '@/app/dashboard/announcements/locale/ru'
import cabinetEn from '@/app/dashboard/cabinet/locale/en'
import cabinetRu from '@/app/dashboard/cabinet/locale/ru'
import deskEn from '@/app/dashboard/desk/locale/en'
import deskRu from '@/app/dashboard/desk/locale/ru'
import deskMyEn from '@/app/dashboard/desk/my/locale/en'
import deskMyRu from '@/app/dashboard/desk/my/locale/ru'
import historyEn from '@/app/dashboard/history/locale/en'
import historyRu from '@/app/dashboard/history/locale/ru'
import notificationsEn from '@/app/dashboard/notifications/locale/en'
import notificationsRu from '@/app/dashboard/notifications/locale/ru'
import orderEn from '@/app/dashboard/order/locale/en'
import orderRu from '@/app/dashboard/order/locale/ru'
import profileEn from '@/app/dashboard/profile/locale/en'
import profileRu from '@/app/dashboard/profile/locale/ru'
import ratingEn from '@/app/dashboard/rating/locale/en'
import ratingRu from '@/app/dashboard/rating/locale/ru'
import settingsEn from '@/app/dashboard/settings/locale/en'
import settingsRu from '@/app/dashboard/settings/locale/ru'
import componentsEn from '@/components/locale/en'
import componentsRu from '@/components/locale/ru'
import hooksEn from '@/hooks/locale/en'
import hooksRu from '@/hooks/locale/ru'
import sharedEn from '@/shared/locale/en'
import sharedRu from '@/shared/locale/ru'
import en from './en'
import ru from './ru'

export type Messages = Record<string, string>

const messagesByLocale: Record<Locale, Messages> = {
	en: { ...en, ...authEn, ...announcementsEn, ...cabinetEn, ...deskEn, ...deskMyEn, ...historyEn, ...notificationsEn, ...orderEn, ...profileEn, ...ratingEn, ...settingsEn, ...componentsEn, ...hooksEn, ...sharedEn },
	ru: { ...ru, ...authRu, ...announcementsRu, ...cabinetRu, ...deskRu, ...deskMyRu, ...historyRu, ...notificationsRu, ...orderRu, ...profileRu, ...ratingRu, ...settingsRu, ...componentsRu, ...hooksRu, ...sharedRu },
}

export const getMessages = (locale: Locale): Messages => {
	return messagesByLocale[locale] ?? ru
}
