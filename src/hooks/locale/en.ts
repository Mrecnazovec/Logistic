const messages: Record<string, string> = {
	// useLogin.ts
	'hooks.auth.login.success': 'Login successful',
	'hooks.auth.login.error': 'Failed to log in',

	// useLogout.ts
	'hooks.auth.logout.success': 'Logged out',
	'hooks.auth.logout.error': 'Failed to log out',

	// useRegister.ts
	'hooks.auth.register.success': 'Registration completed',
	'hooks.auth.register.error': 'Failed to complete registration',

	// queries/agreements/useAcceptAgreement.ts
	'hooks.agreements.accept.success': 'Agreement confirmed',
	'hooks.agreements.accept.error': 'Failed to confirm agreement',

	// queries/agreements/useRejectAgreement.ts
	'hooks.agreements.reject.success': 'Agreement declined',
	'hooks.agreements.reject.error': 'Failed to decline agreement',

	// queries/auth/useChangeRole.ts
	'hooks.auth.changeRole.success': 'Role updated',
	'hooks.auth.changeRole.error': 'Failed to update role',

	// queries/auth/useVerifyEmail.ts
	'hooks.auth.verifyEmail.success': 'Email verified',
	'hooks.auth.verifyEmail.error': 'Failed to verify email',

	// queries/auth/useResetPassword.ts
	'hooks.auth.resetPassword.success': 'Password updated',
	'hooks.auth.resetPassword.error': 'Failed to update password',

	// queries/auth/useChangePassword.ts
	'hooks.auth.changePassword.success': 'Password changed',
	'hooks.auth.changePassword.error': 'Failed to change password',

	// queries/auth/useResendVerify.ts
	'hooks.auth.resendVerify.success': 'Verification email sent',
	'hooks.auth.resendVerify.error': 'Failed to send verification email',

	// queries/auth/useForgotPassword.ts
	'hooks.auth.forgotPassword.success': 'Reset email sent',
	'hooks.auth.forgotPassword.error': 'Failed to send reset email',

	// queries/me/useUpdateMe.ts
	'hooks.me.update.success': 'Profile updated',
	'hooks.me.update.error': 'Profile update failed',

	// queries/me/usePatchMe.ts
	'hooks.me.patch.success': 'Profile updated',
	'hooks.me.patch.error': 'Profile update failed',

	// queries/me/useGetMe.ts
	'hooks.me.get.error': 'Не удалось загрузить профиль',

	// queries/support/useCreateSupportTicket.ts
	'hooks.support.create.success': 'Message sent',
	'hooks.support.create.error': 'Failed to send message',

	// queries/support/useCreateConsultation.ts
	'hooks.support.consultation.success': 'Consultation request sent',
	'hooks.support.consultation.error': 'Failed to send consultation request',

	// queries/offers/useCreateOffer.ts
	'hooks.offers.create.success': 'Offer created',
	'hooks.offers.create.error': 'Failed to create offer',

	// queries/offers/useDeleteOffer.ts
	'hooks.offers.delete.success': 'Offer deleted',
	'hooks.offers.delete.error': 'Failed to delete offer',

	// queries/offers/useAction/useAcceptOffer.ts
	'hooks.offers.accept.success': 'Offer accepted',
	'hooks.offers.accept.error': 'Failed to accept offer',

	// queries/offers/useAction/useCounterOffer.ts
	'hooks.offers.counter.success': 'Counter offer sent',
	'hooks.offers.counter.error': 'Failed to send counter offer',

	// queries/offers/useAction/useInviteOffer.ts
	'hooks.offers.invite.success': 'Invite sent',
	'hooks.offers.invite.error': 'Failed to send invite',

	// queries/offers/useAction/useRejectOffer.ts
	'hooks.offers.reject.success': 'Offer declined',
	'hooks.offers.reject.error': 'Failed to decline offer',

	// queries/loads/useToggleLoadVisibility.ts
	'hooks.loads.toggleVisibility.success': 'Announcement visibility updated',
	'hooks.loads.toggleVisibility.error': 'Failed to update announcement visibility',

	// queries/loads/useRefreshLoad.ts
	'hooks.loads.refresh.success': 'Announcement refreshed',
	'hooks.loads.refresh.error': 'Failed to refresh announcement',

	// queries/loads/usePutLoad.ts
	'hooks.loads.put.success': 'Announcement updated',
	'hooks.loads.put.error': 'Failed to update announcement',

	// queries/loads/usePatchLoad.ts
	'hooks.loads.patch.success': 'Announcement updated',
	'hooks.loads.patch.error': 'Failed to update announcement',

	// queries/loads/useCreateLoad.ts
	'hooks.loads.create.success': 'Announcement created',
	'hooks.loads.create.error': 'Failed to create announcement',

	// queries/loads/useCancelLoad.ts
	'hooks.loads.cancel.success': 'Announcement cancelled',
	'hooks.loads.cancel.error': 'Failed to cancel announcement',

	// queries/loads/useGenerateLoadInvite.ts
	'hooks.loads.generateInvite.success': 'Invite link generated',
	'hooks.loads.generateInvite.error': 'Failed to generate invite link',

	// queries/ratings/useCreateRating.ts
	'hooks.ratings.create.success': 'Rating sent',
	'hooks.ratings.create.error': 'Failed to send rating',

	// queries/ratings/useDeleteRating.ts
	'hooks.ratings.delete.success': 'Rating deleted',
	'hooks.ratings.delete.error': 'Failed to delete rating',

	// queries/ratings/useUpdateRating.ts
	'hooks.ratings.update.success': 'Rating updated',
	'hooks.ratings.update.error': 'Failed to update rating',

	// queries/ratings/usePatchRating.ts
	'hooks.ratings.patch.success': 'Rating updated',
	'hooks.ratings.patch.error': 'Failed to update rating',

	// queries/payments/useConfirmPaymentLogistic.ts
	'hooks.payments.confirm.logistic.success': 'Payment confirmed by logistic',
	'hooks.payments.confirm.logistic.error': 'Failed to confirm payment as logistic',

	// queries/payments/useConfirmPaymentCustomer.ts
	'hooks.payments.confirm.customer.success': 'Payment confirmed by customer',
	'hooks.payments.confirm.customer.error': 'Failed to confirm payment as customer',

	// queries/payments/useConfirmPaymentCarrier.ts
	'hooks.payments.confirm.carrier.success': 'Payment confirmed by carrier',
	'hooks.payments.confirm.carrier.error': 'Failed to confirm payment as carrier',

	// queries/orders/useAcceptOrderInvite.ts
	'hooks.orders.acceptInvite.success': 'Invitation accepted',
	'hooks.orders.acceptInvite.error': 'Failed to accept invitation',
	'hooks.orders.declineInvite.success': 'Invitation declined',
	'hooks.orders.declineInvite.error': 'Failed to decline invitation',

	// queries/orders/useConfirmOrderTerms.ts
	'hooks.orders.confirmTerms.success': 'Order terms confirmed',
	'hooks.orders.confirmTerms.error': 'Failed to confirm order terms',

	// queries/orders/useUploadOrderDocument.ts
	'hooks.orders.uploadDocument.success': 'Document uploaded',
	'hooks.orders.uploadDocument.error': 'Failed to upload document',

	// queries/orders/useUpdateOrderStatus.ts
	'hooks.orders.updateStatus.success': 'Driver status updated',
	'hooks.orders.updateStatus.error': 'Failed to update driver status',

	// queries/orders/useUpdateOrder.ts
	'hooks.orders.update.success': 'Order updated',
	'hooks.orders.update.error': 'Failed to update order',

	// queries/orders/usePatchOrder.ts
	'hooks.orders.patch.success': 'Order updated',
	'hooks.orders.patch.error': 'Failed to update order',

	// queries/orders/useInviteOrderById.ts
	'hooks.orders.inviteById.success': 'Invitation sent to user',
	'hooks.orders.inviteById.error': 'Failed to send invitation',

	// queries/orders/useDeleteOrder.ts
	'hooks.orders.delete.success': 'Order deleted',
	'hooks.orders.delete.error': 'Failed to delete order',

	// queries/orders/useCreateOrder.ts
	'hooks.orders.create.success': 'Order created',
	'hooks.orders.create.error': 'Failed to create order',

	// queries/orders/useGenerateOrderInvite.ts
	'hooks.orders.generateInvite.success': 'Order invite updated',
	'hooks.orders.generateInvite.error': 'Failed to create order invite',
}

export default messages
