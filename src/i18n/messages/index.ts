import authEn from '@/app/[locale]/auth/locale/en'
import authRu from '@/app/[locale]/auth/locale/ru'
import authUz from '@/app/[locale]/auth/locale/uz'
import announcementsEn from '@/app/[locale]/dashboard/announcements/locale/en'
import announcementsRu from '@/app/[locale]/dashboard/announcements/locale/ru'
import announcementsUz from '@/app/[locale]/dashboard/announcements/locale/uz'
import cabinetEn from '@/app/[locale]/dashboard/cabinet/locale/en'
import cabinetRu from '@/app/[locale]/dashboard/cabinet/locale/ru'
import cabinetUz from '@/app/[locale]/dashboard/cabinet/locale/uz'
import deskEn from '@/app/[locale]/dashboard/desk/locale/en'
import deskRu from '@/app/[locale]/dashboard/desk/locale/ru'
import deskUz from '@/app/[locale]/dashboard/desk/locale/uz'
import deskMyEn from '@/app/[locale]/dashboard/desk/my/locale/en'
import deskMyRu from '@/app/[locale]/dashboard/desk/my/locale/ru'
import deskMyUz from '@/app/[locale]/dashboard/desk/my/locale/uz'
import historyEn from '@/app/[locale]/dashboard/history/locale/en'
import historyRu from '@/app/[locale]/dashboard/history/locale/ru'
import historyUz from '@/app/[locale]/dashboard/history/locale/uz'
import notificationsEn from '@/app/[locale]/dashboard/notifications/locale/en'
import notificationsRu from '@/app/[locale]/dashboard/notifications/locale/ru'
import notificationsUz from '@/app/[locale]/dashboard/notifications/locale/uz'
import orderEn from '@/app/[locale]/dashboard/order/locale/en'
import orderRu from '@/app/[locale]/dashboard/order/locale/ru'
import orderUz from '@/app/[locale]/dashboard/order/locale/uz'
import profileEn from '@/app/[locale]/dashboard/profile/locale/en'
import profileRu from '@/app/[locale]/dashboard/profile/locale/ru'
import profileUz from '@/app/[locale]/dashboard/profile/locale/uz'
import ratingEn from '@/app/[locale]/dashboard/rating/locale/en'
import ratingRu from '@/app/[locale]/dashboard/rating/locale/ru'
import ratingUz from '@/app/[locale]/dashboard/rating/locale/uz'
import settingsEn from '@/app/[locale]/dashboard/settings/locale/en'
import settingsRu from '@/app/[locale]/dashboard/settings/locale/ru'
import settingsUz from '@/app/[locale]/dashboard/settings/locale/uz'
import transportationEn from '@/app/[locale]/dashboard/transportation/locale/en'
import transportationRu from '@/app/[locale]/dashboard/transportation/locale/ru'
import transportationUz from '@/app/[locale]/dashboard/transportation/locale/uz'
import componentsEn from '@/components/locale/en'
import componentsRu from '@/components/locale/ru'
import componentsUz from '@/components/locale/uz'
import hooksEn from '@/hooks/locale/en'
import hooksRu from '@/hooks/locale/ru'
import hooksUz from '@/hooks/locale/uz'
import sharedEn from '@/shared/locale/en'
import sharedRu from '@/shared/locale/ru'
import sharedUz from '@/shared/locale/uz'
import type { Locale } from '../config'
import en from './en'
import ru from './ru'
import uz from './uz'

export type Messages = Record<string, string>

const messagesByLocale: Record<Locale, Messages> = {
	en: { ...en, ...authEn, ...announcementsEn, ...cabinetEn, ...deskEn, ...deskMyEn, ...historyEn, ...notificationsEn, ...orderEn, ...profileEn, ...ratingEn, ...settingsEn, ...transportationEn, ...componentsEn, ...hooksEn, ...sharedEn },
	ru: { ...ru, ...authRu, ...announcementsRu, ...cabinetRu, ...deskRu, ...deskMyRu, ...historyRu, ...notificationsRu, ...orderRu, ...profileRu, ...ratingRu, ...settingsRu, ...transportationRu, ...componentsRu, ...hooksRu, ...sharedRu },
	uz: { ...uz, ...authUz, ...announcementsUz, ...cabinetUz, ...deskUz, ...deskMyUz, ...historyUz, ...notificationsUz, ...orderUz, ...profileUz, ...ratingUz, ...settingsUz, ...transportationUz, ...componentsUz, ...hooksUz, ...sharedUz },
}

export const getMessages = (locale: Locale): Messages => {
	return messagesByLocale[locale] ?? ru
}
