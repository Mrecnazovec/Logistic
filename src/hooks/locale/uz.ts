const messages: Record<string, string> = {
	// useLogin.ts
	'hooks.auth.login.success': 'Kirish muvaffaqiyatli',
	'hooks.auth.login.error': 'Kirish amalga oshmadi',

	// useLogout.ts
	'hooks.auth.logout.success': 'Chiqish bajarildi',
	'hooks.auth.logout.error': 'Chiqish amalga oshmadi',

	// useRegister.ts
	'hooks.auth.register.success': "Ro'yxatdan o'tish yakunlandi",
	'hooks.auth.register.error': "Ro'yxatdan o'tishni yakunlab bo'lmadi",

	// queries/agreements/useAcceptAgreement.ts
	'hooks.agreements.accept.success': 'Kelishuv tasdiqlandi',
	'hooks.agreements.accept.error': 'Kelishuvni tasdiqlab bo\'lmadi',

	// queries/agreements/useRejectAgreement.ts
	'hooks.agreements.reject.success': 'Kelishuv rad etildi',
	'hooks.agreements.reject.error': 'Kelishuvni rad etib bo\'lmadi',

	// queries/auth/useChangeRole.ts
	'hooks.auth.changeRole.success': 'Rol yangilandi',
	'hooks.auth.changeRole.error': 'Rolni yangilab bo\'lmadi',

	// queries/auth/useVerifyEmail.ts
	'hooks.auth.verifyEmail.success': 'Email tasdiqlandi',
	'hooks.auth.verifyEmail.error': 'Emailni tasdiqlab bo\'lmadi',

	// queries/auth/useResetPassword.ts
	'hooks.auth.resetPassword.success': 'Parol yangilandi',
	'hooks.auth.resetPassword.error': 'Parolni yangilab bo\'lmadi',

	// queries/auth/useResendVerify.ts
	'hooks.auth.resendVerify.success': 'Tasdiqlash xati yuborildi',
	'hooks.auth.resendVerify.error': 'Tasdiqlash xatini yuborib bo\'lmadi',

	// queries/auth/useForgotPassword.ts
	'hooks.auth.forgotPassword.success': 'Parolni tiklash xati yuborildi',
	'hooks.auth.forgotPassword.error': 'Parolni tiklash xatini yuborib bo\'lmadi',

	// queries/me/useUpdateMe.ts
	'hooks.me.update.success': 'Profil yangilandi',
	'hooks.me.update.error': 'Profilni yangilab bo\'lmadi',

	// queries/me/usePatchMe.ts
	'hooks.me.patch.success': 'Profil yangilandi',
	'hooks.me.patch.error': 'Profilni yangilab bo\'lmadi',

	// queries/me/useGetMe.ts
	'hooks.me.get.error': 'Profilni yuklab bo\'lmadi',

	// queries/support/useCreateSupportTicket.ts
	'hooks.support.create.success': 'Xabar yuborildi',
	'hooks.support.create.error': 'Xabarni yuborib bo\'lmadi',

	// queries/offers/useCreateOffer.ts
	'hooks.offers.create.success': 'Taklif yaratildi',
	'hooks.offers.create.error': 'Taklifni yaratib bo\'lmadi',

	// queries/offers/useDeleteOffer.ts
	'hooks.offers.delete.success': 'Taklif o\'chirildi',
	'hooks.offers.delete.error': 'Taklifni o\'chirib bo\'lmadi',

	// queries/offers/useAction/useAcceptOffer.ts
	'hooks.offers.accept.success': 'Taklif qabul qilindi',
	'hooks.offers.accept.error': 'Taklifni qabul qilib bo\'lmadi',

	// queries/offers/useAction/useCounterOffer.ts
	'hooks.offers.counter.success': 'Qarshi taklif yuborildi',
	'hooks.offers.counter.error': 'Qarshi taklifni yuborib bo\'lmadi',

	// queries/offers/useAction/useInviteOffer.ts
	'hooks.offers.invite.success': 'Taklifnoma yuborildi',
	'hooks.offers.invite.error': 'Taklifnomani yuborib bo\'lmadi',

	// queries/offers/useAction/useRejectOffer.ts
	'hooks.offers.reject.success': 'Taklif rad etildi',
	'hooks.offers.reject.error': 'Taklifni rad etib bo\'lmadi',

	// queries/loads/useToggleLoadVisibility.ts
	'hooks.loads.toggleVisibility.success': "E'lon ko'rinishi yangilandi",
	'hooks.loads.toggleVisibility.error': "E'lon ko'rinishini yangilab bo'lmadi",

	// queries/loads/useRefreshLoad.ts
	'hooks.loads.refresh.success': "E'lon yangilandi",
	'hooks.loads.refresh.error': "E'lonni yangilab bo'lmadi",

	// queries/loads/usePutLoad.ts
	'hooks.loads.put.success': "E'lon yangilandi",
	'hooks.loads.put.error': "E'lonni yangilab bo'lmadi",

	// queries/loads/usePatchLoad.ts
	'hooks.loads.patch.success': "E'lon yangilandi",
	'hooks.loads.patch.error': "E'lonni yangilab bo'lmadi",

	// queries/loads/useCreateLoad.ts
	'hooks.loads.create.success': "E'lon yaratildi",
	'hooks.loads.create.error': "E'lonni yaratib bo'lmadi",

	// queries/loads/useCancelLoad.ts
	'hooks.loads.cancel.success': "E'lon bekor qilindi",
	'hooks.loads.cancel.error': "E'lonni bekor qilib bo'lmadi",

	// queries/loads/useGenerateLoadInvite.ts
	'hooks.loads.generateInvite.success': 'Taklifnoma havolasi yaratildi',
	'hooks.loads.generateInvite.error': 'Taklifnoma havolasini yaratib bo\'lmadi',

	// queries/ratings/useCreateRating.ts
	'hooks.ratings.create.success': 'Baholash yuborildi',
	'hooks.ratings.create.error': 'Baholashni yuborib bo\'lmadi',

	// queries/ratings/useDeleteRating.ts
	'hooks.ratings.delete.success': 'Baholash o\'chirildi',
	'hooks.ratings.delete.error': 'Baholashni o\'chirib bo\'lmadi',

	// queries/ratings/useUpdateRating.ts
	'hooks.ratings.update.success': 'Baholash yangilandi',
	'hooks.ratings.update.error': 'Baholashni yangilab bo\'lmadi',

	// queries/ratings/usePatchRating.ts
	'hooks.ratings.patch.success': 'Baholash yangilandi',
	'hooks.ratings.patch.error': 'Baholashni yangilab bo\'lmadi',

	// queries/payments/useConfirmPaymentLogistic.ts
	'hooks.payments.confirm.logistic.success': "To'lov logistika tomonidan tasdiqlandi",
	'hooks.payments.confirm.logistic.error': "Logistika sifatida to'lovni tasdiqlab bo'lmadi",

	// queries/payments/useConfirmPaymentCustomer.ts
	'hooks.payments.confirm.customer.success': "To'lov mijoz tomonidan tasdiqlandi",
	'hooks.payments.confirm.customer.error': "Mijoz sifatida to'lovni tasdiqlab bo'lmadi",

	// queries/payments/useConfirmPaymentCarrier.ts
	'hooks.payments.confirm.carrier.success': "To'lov tashuvchi tomonidan tasdiqlandi",
	'hooks.payments.confirm.carrier.error': "Tashuvchi sifatida to'lovni tasdiqlab bo'lmadi",

	// queries/orders/useAcceptOrderInvite.ts
	'hooks.orders.acceptInvite.success': 'Taklif qabul qilindi',
	'hooks.orders.acceptInvite.error': 'Taklifni qabul qilib bo\'lmadi',

	// queries/orders/useConfirmOrderTerms.ts
	'hooks.orders.confirmTerms.success': 'Buyurtma shartlari tasdiqlandi',
	'hooks.orders.confirmTerms.error': 'Buyurtma shartlarini tasdiqlab bo\'lmadi',

	// queries/orders/useUploadOrderDocument.ts
	'hooks.orders.uploadDocument.success': 'Hujjat yuklandi',
	'hooks.orders.uploadDocument.error': 'Hujjatni yuklab bo\'lmadi',

	// queries/orders/useUpdateOrderStatus.ts
	'hooks.orders.updateStatus.success': 'Haydovchi holati yangilandi',
	'hooks.orders.updateStatus.error': 'Haydovchi holatini yangilab bo\'lmadi',

	// queries/orders/useUpdateOrder.ts
	'hooks.orders.update.success': 'Buyurtma yangilandi',
	'hooks.orders.update.error': 'Buyurtmani yangilab bo\'lmadi',

	// queries/orders/usePatchOrder.ts
	'hooks.orders.patch.success': 'Buyurtma yangilandi',
	'hooks.orders.patch.error': 'Buyurtmani yangilab bo\'lmadi',

	// queries/orders/useInviteOrderById.ts
	'hooks.orders.inviteById.success': 'Foydalanuvchiga taklif yuborildi',
	'hooks.orders.inviteById.error': 'Taklifni yuborib bo\'lmadi',

	// queries/orders/useDeleteOrder.ts
	'hooks.orders.delete.success': 'Buyurtma o\'chirildi',
	'hooks.orders.delete.error': 'Buyurtmani o\'chirib bo\'lmadi',

	// queries/orders/useCreateOrder.ts
	'hooks.orders.create.success': 'Buyurtma yaratildi',
	'hooks.orders.create.error': 'Buyurtmani yaratib bo\'lmadi',

	// queries/orders/useGenerateOrderInvite.ts
	'hooks.orders.generateInvite.success': 'Buyurtma taklifnomasi yangilandi',
	'hooks.orders.generateInvite.error': 'Buyurtma taklifnomasini yaratib bo\'lmadi',
}

export default messages
