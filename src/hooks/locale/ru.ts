const messages: Record<string, string> = {
	// useLogin.ts
	'hooks.auth.login.success': 'Вход выполнен',
	'hooks.auth.login.error': 'Не удалось выполнить вход',

	// useLogout.ts
	'hooks.auth.logout.success': 'Вы вышли из аккаунта',
	'hooks.auth.logout.error': 'Не удалось выйти',

	// useRegister.ts
	'hooks.auth.register.success': 'Регистрация завершена',
	'hooks.auth.register.error': 'Не удалось завершить регистрацию',

	// queries/agreements/useAcceptAgreement.ts
	'hooks.agreements.accept.success': 'Соглашение подтверждено',
	'hooks.agreements.accept.error': 'Не удалось подтвердить соглашение',

	// queries/agreements/useRejectAgreement.ts
	'hooks.agreements.reject.success': 'Соглашение отклонено',
	'hooks.agreements.reject.error': 'Не удалось отклонить соглашение',

	// queries/auth/useChangeRole.ts
	'hooks.auth.changeRole.success': 'Роль обновлена',
	'hooks.auth.changeRole.error': 'Не удалось обновить роль',

	// queries/auth/useVerifyEmail.ts
	'hooks.auth.verifyEmail.success': 'Email успешно подтвержден',
	'hooks.auth.verifyEmail.error': 'Не удалось подтвердить Email',

	// queries/auth/useResetPassword.ts
	'hooks.auth.resetPassword.success': 'Пароль обновлен',
	'hooks.auth.resetPassword.error': 'Не удалось обновить пароль',

// queries/auth/useChangePassword.ts
'hooks.auth.changePassword.success': 'Пароль изменен',
'hooks.auth.changePassword.error': 'Не удалось изменить пароль',

	// queries/auth/useResendVerify.ts
	'hooks.auth.resendVerify.success': 'Письмо подтверждения отправлено',
	'hooks.auth.resendVerify.error': 'Не удалось отправить письмо подтверждения',

	// queries/auth/useForgotPassword.ts
	'hooks.auth.forgotPassword.success': 'Письмо для сброса отправлено',
	'hooks.auth.forgotPassword.error': 'Не удалось отправить письмо для сброса',

	// queries/me/useUpdateMe.ts
	'hooks.me.update.success': 'Профиль обновлен',
	'hooks.me.update.error': 'Ошибка обновления профиля',

	// queries/me/usePatchMe.ts
	'hooks.me.patch.success': 'Профиль обновлен',
	'hooks.me.patch.error': 'Ошибка обновления профиля',

	// queries/me/useGetMe.ts
	'hooks.me.get.error': 'Не удалось загрузить профиль',

	// queries/support/useCreateSupportTicket.ts
	'hooks.support.create.success': 'Сообщение отправлено',
	'hooks.support.create.error': 'Не удалось отправить сообщение',

// queries/support/useCreateConsultation.ts
'hooks.support.consultation.success': 'Запрос на консультацию отправлен',
'hooks.support.consultation.error': 'Не удалось отправить запрос на консультацию',

	// queries/offers/useCreateOffer.ts
	'hooks.offers.create.success': 'Оффер создан',
	'hooks.offers.create.error': 'Ошибка при создании оффера',

	// queries/offers/useDeleteOffer.ts
	'hooks.offers.delete.success': 'Оффер удален',
	'hooks.offers.delete.error': 'Ошибка при удалении оффера',

	// queries/offers/useAction/useAcceptOffer.ts
	'hooks.offers.accept.success': 'Предложение принято',
	'hooks.offers.accept.error': 'Не удалось принять предложение',

	// queries/offers/useAction/useCounterOffer.ts
	'hooks.offers.counter.success': 'Контр-предложение отправлено',
	'hooks.offers.counter.error': 'Не удалось отправить контр-предложение',

	// queries/offers/useAction/useInviteOffer.ts
	'hooks.offers.invite.success': 'Инвайт отправлен',
	'hooks.offers.invite.error': 'Ошибка при отправке инвайта',

	// queries/offers/useAction/useRejectOffer.ts
	'hooks.offers.reject.success': 'Предложение отклонено',
	'hooks.offers.reject.error': 'Не удалось отклонить предложение',

	// queries/loads/useToggleLoadVisibility.ts
	'hooks.loads.toggleVisibility.success': 'Видимость объявления изменена',
	'hooks.loads.toggleVisibility.error': 'Не удалось изменить видимость объявления',

	// queries/loads/useRefreshLoad.ts
	'hooks.loads.refresh.success': 'Объявление обновлено',
	'hooks.loads.refresh.error': 'Не удалось обновить объявление',

	// queries/loads/usePutLoad.ts
	'hooks.loads.put.success': 'Объявление обновлено',
	'hooks.loads.put.error': 'Не удалось обновить объявление',

	// queries/loads/usePatchLoad.ts
	'hooks.loads.patch.success': 'Объявление обновлено',
	'hooks.loads.patch.error': 'Не удалось обновить объявление',

	// queries/loads/useCreateLoad.ts
	'hooks.loads.create.success': 'Объявление создано',
	'hooks.loads.create.error': 'Не удалось создать объявление',

	// queries/loads/useCancelLoad.ts
	'hooks.loads.cancel.success': 'Объявление отменено',
	'hooks.loads.cancel.error': 'Не удалось отменить объявление',

	// queries/loads/useGenerateLoadInvite.ts
	'hooks.loads.generateInvite.success': 'Ссылка приглашения сгенерирована.',
	'hooks.loads.generateInvite.error': 'Не удалось сгенерировать ссылку приглашения.',

	// queries/ratings/useCreateRating.ts
	'hooks.ratings.create.success': 'Оценка отправлена',
	'hooks.ratings.create.error': 'Не удалось отправить оценку',

	// queries/ratings/useDeleteRating.ts
	'hooks.ratings.delete.success': 'Оценка удалена',
	'hooks.ratings.delete.error': 'Не удалось удалить оценку',

	// queries/ratings/useUpdateRating.ts
	'hooks.ratings.update.success': 'Оценка обновлена',
	'hooks.ratings.update.error': 'Не удалось обновить оценку',

	// queries/ratings/usePatchRating.ts
	'hooks.ratings.patch.success': 'Оценка обновлена',
	'hooks.ratings.patch.error': 'Не удалось обновить оценку',

	// queries/payments/useConfirmPaymentLogistic.ts
	'hooks.payments.confirm.logistic.success': 'Оплата подтверждена логистом',
	'hooks.payments.confirm.logistic.error': 'Не удалось подтвердить оплату логистом',

	// queries/payments/useConfirmPaymentCustomer.ts
	'hooks.payments.confirm.customer.success': 'Оплата подтверждена заказчиком',
	'hooks.payments.confirm.customer.error': 'Не удалось подтвердить оплату заказчиком',

	// queries/payments/useConfirmPaymentCarrier.ts
	'hooks.payments.confirm.carrier.success': 'Оплата подтверждена перевозчиком',
	'hooks.payments.confirm.carrier.error': 'Не удалось подтвердить оплату перевозчиком',

	// queries/orders/useAcceptOrderInvite.ts
	'hooks.orders.acceptInvite.success': 'Приглашение принято.',
	'hooks.orders.acceptInvite.error': 'Не удалось принять приглашение.',

	// queries/orders/useConfirmOrderTerms.ts
	'hooks.orders.confirmTerms.success': 'Условия заказа подтверждены',
	'hooks.orders.confirmTerms.error': 'Не удалось подтвердить условия заказа',

	// queries/orders/useUploadOrderDocument.ts
	'hooks.orders.uploadDocument.success': 'Документ загружен',
	'hooks.orders.uploadDocument.error': 'Не удалось загрузить документ',

	// queries/orders/useUpdateOrderStatus.ts
	'hooks.orders.updateStatus.success': 'Статус водителя обновлен',
	'hooks.orders.updateStatus.error': 'Ошибка при обновлении статуса водителя',

	// queries/orders/useUpdateOrder.ts
	'hooks.orders.update.success': 'Заказ обновлен',
	'hooks.orders.update.error': 'Не удалось обновить заказ',

	// queries/orders/usePatchOrder.ts
	'hooks.orders.patch.success': 'Заказ обновлен',
	'hooks.orders.patch.error': 'Не удалось обновить заказ',

	// queries/orders/useInviteOrderById.ts
	'hooks.orders.inviteById.success': 'Приглашение отправлено пользователю.',
	'hooks.orders.inviteById.error': 'Не удалось отправить приглашение.',

	// queries/orders/useDeleteOrder.ts
	'hooks.orders.delete.success': 'Заказ удален',
	'hooks.orders.delete.error': 'Не удалось удалить заказ',

	// queries/orders/useCreateOrder.ts
	'hooks.orders.create.success': 'Заказ создан',
	'hooks.orders.create.error': 'Не удалось создать заказ',

	// queries/orders/useGenerateOrderInvite.ts
	'hooks.orders.generateInvite.success': 'Приглашение по заказу обновлено.',
	'hooks.orders.generateInvite.error': 'Не удалось создать приглашение для заказа.',
}

export default messages

