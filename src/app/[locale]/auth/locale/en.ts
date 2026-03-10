const messages: Record<string, string> = {
	// AuthPage.tsx
	'auth.signUp': 'Create account',
	'auth.signIn': 'Sign in',
	'auth.title': 'Sign in to your account',
	'auth.submit': 'Sign in',
	'auth.hero': 'A high-quality software solution for managing your business process.',

	// AuthField.tsx
	'auth.fields.loginRequired': 'Login is required',
	'auth.fields.loginLabel': 'Enter login',
	'auth.fields.loginPlaceholder': 'Enter email',
	'auth.fields.passwordRequired': 'Password is required',
	'auth.fields.passwordLabel': 'Enter password',
	'auth.fields.passwordPlaceholder': 'Enter password',
	'auth.fields.rememberMe': 'Remember me',
	'auth.fields.forgotPassword': 'Forgot password?',

	// useAuthForm.ts
	'auth.toast.success': 'Signed in successfully',
	'auth.toast.error': 'Failed to sign in',

	// auth/page.tsx
	'auth.meta.title': 'Sign in',

	// RegisterPage.tsx
	'register.title': 'Sign up',
	'register.companyInfo': 'Company information',
	'register.confirmation': 'Confirmation',
	'register.welcomeTitle': 'Welcome to {siteName}!',
	'register.welcomeSubtitle': 'Please choose your role to continue registration',
	'register.otpSent': 'We just sent a verification code to {phone}',
	'register.yourPhone': 'your phone',
	'register.resendIn': 'You can resend the code in {time}',
	'register.resendCode': 'Resend code',
	'register.phoneVerified': 'Phone number verified. You can complete your registration.',
	'register.finish': 'Create account',
	'register.role.customer.title': 'Cargo owner',
	'register.role.customer.description': 'A company or person who needs to move, store, or process goods.',
	'register.role.customer.button': 'cargo owner',
	'register.role.carrier.title': 'Carrier',
	'register.role.carrier.description':
		'Logistics executor. Their task is to pick up the cargo from the customer and deliver it safely and on time.',
	'register.role.carrier.button': 'carrier',
	'register.role.logistic.title': 'Forwarder',
	'register.role.logistic.description':
		'A specialist who organizes and manages the movement and storage of goods so the cargo arrives on time and with minimal costs.',
	'register.role.logistic.button': 'forwarder',
	'register.role.cta': 'Sign up as',
	'register.role.dialogTitle': 'Which role describes you?',
	'register.errors.sendOtp': 'Failed to send confirmation code',
	'register.errors.invalidOtp': 'The confirmation code is invalid',
	'register.errors.verifyOtp': 'Failed to verify code',
	'register.errors.phoneRequired': 'Enter a phone number',
	'register.errors.otpRequired': 'Enter the confirmation code',

	// RegisterField.tsx
	'register.fields.loginRequired': 'Email is required',
	'register.fields.loginLabel': 'Enter login',
	'register.fields.loginPlaceholder': 'Enter login',
	'register.fields.passwordRequired': 'Password is required',
	'register.fields.passwordLabel': 'Enter password',
	'register.fields.passwordPlaceholder': 'Enter password',
	'register.fields.passwordMin': 'Password must be at least 8 characters',
	'register.fields.passwordMismatch': 'Passwords do not match',
	'register.fields.passwordShow': 'Show password',
	'register.fields.passwordHide': 'Hide password',
	'register.fields.passwordRepeatRequired': 'Confirm password',
	'register.fields.passwordRepeatLabel': 'Confirm password',
	'register.fields.passwordRepeatPlaceholder': 'Repeat password',

	// RegisterCarrier.tsx
	'register.company.firstNameRequired': 'Full name is required',
	'register.company.firstNameLabel': 'Enter full name',
	'register.company.firstNamePlaceholder': 'Enter full name',
	'register.company.emailLabel': 'Enter email',
	'register.company.emailPlaceholder': 'Enter email',
	'register.company.phoneRequired': 'Phone is required',
	'register.company.phoneLabel': 'Enter phone number',
	'register.company.phonePlaceholder': 'Phone number',
	'register.company.countryLabel': 'Choose country',
	'register.company.cityLabel': 'Choose city',
	'register.company.cityPlaceholder': 'Choose city',
	'register.company.companyNameRequired': 'Company name is required',
	'register.company.companyNameLabel': 'Enter company name',
	'register.company.companyNamePlaceholder': 'Enter company name',
	'register.transport.label': 'Transport',
	'register.transport.placeholder': 'Enter transport name',
	'register.vehicle.transportNameLabel': 'Enter carrier vehicle name',
	'register.vehicle.transportNamePlaceholder': 'Enter carrier vehicle name',
	'register.vehicle.carNumberLabel': 'Enter vehicle number',
	'register.vehicle.carNumberPlaceholder': 'Enter vehicle number',
	'register.vehicle.trailerNumberLabel': 'Enter trailer number',
	'register.vehicle.trailerNumberPlaceholder': 'Enter trailer number',
	'register.vehicle.driverLicenseLabel': 'Enter driver license number/series',
	'register.vehicle.driverLicensePlaceholder': 'Enter driver license number/series',

	// useRegisterForm.ts
	'register.toast.success': 'Registration completed successfully',
	'register.toast.error': 'Failed to complete registration',

	// register/page.tsx
	'register.meta.title': 'Sign up',
}

export default messages
