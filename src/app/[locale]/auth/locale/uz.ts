const messages: Record<string, string> = {
	// AuthPage.tsx
	'auth.signUp': "Ro'yxatdan o'tish",
	'auth.signIn': 'Kirish',
	'auth.title': 'Login ma’lumotlaringizni kiriting',
	'auth.submit': 'Kirish',
	'auth.hero': 'Biznes jarayonlarini boshqarish uchun yuqori sifatli dasturiy yechim.',

	// AuthField.tsx
	'auth.fields.loginRequired': 'Login talab qilinadi',
	'auth.fields.loginLabel': 'Loginni kiriting',
	'auth.fields.loginPlaceholder': 'Emailni kiriting',
	'auth.fields.passwordRequired': 'Parol talab qilinadi',
	'auth.fields.passwordLabel': 'Parolni kiriting',
	'auth.fields.passwordPlaceholder': 'Parolni kiriting',
	'auth.fields.rememberMe': 'Meni saqlab qol',
	'auth.fields.forgotPassword': 'Parolni unutdingizmi?',

	// useAuthForm.ts
	'auth.toast.success': 'Muvaffaqiyatli kirish',
	'auth.toast.error': "Noto'g'ri hisob ma'lumotlari",

	// auth/page.tsx
	'auth.meta.title': 'Kirish',

	// RegisterPage.tsx
	'register.title': "Ro'yxatdan o'tish",
	'register.companyInfo': "Kompaniya ma'lumotlari",
	'register.confirmation': 'Tasdiqlash',
	'register.welcomeTitle': '{siteName} web platformasiga, xush kelibsiz!',
	'register.welcomeSubtitle': "Ro'yxatdan o'tishni davom ettirish uchun rolingizni tanlang",
	'register.otpSent': 'Biz {phone} raqamiga tasdiqlash kodini yubordik',
	'register.yourPhone': 'telefoningiz',
	'register.resendIn': "{time} dan so'ng kodni qayta yuborishingiz mumkin",
	'register.resendCode': 'Kodni qayta yuborish',
	'register.phoneVerified': "Telefon raqami tasdiqlandi. Ro'yxatdan o'tishni yakunlashingiz mumkin.",
	'register.finish': "Ro'yxatdan o'tish",
	'register.role.customer.title': 'Yuk egasi',
	'register.role.customer.description': "Yukni ko'chirish, saqlash yoki qayta ishlashga muhtoj kompaniya yoki shaxs.",
	'register.role.customer.button': 'yuk egasi',
	'register.role.carrier.title': 'Haydovchi',
	'register.role.carrier.description': "Logistika ijrochisi. Vazifasi yukni mijozdan olib, xavfsiz va o'z vaqtida yetkazish.",
	'register.role.carrier.button': 'haydovchi',
	'register.role.logistic.title': 'Ekspeditor',
	'register.role.logistic.description':
		"Yuk harakati va saqlanishini tashkil etadigan mutaxassis; yukni o'z vaqtida va minimal xarajat bilan yetkazadi.",
	'register.role.logistic.button': 'ekspeditor',
	'register.role.cta': "Ro'yxatdan o'tish:",
	'register.role.dialogTitle': 'Sizga qaysi rol mos?',
	'register.errors.sendOtp': "Tasdiqlash kodini yuborib bo'lmadi",
	'register.errors.invalidOtp': "Tasdiqlash kodi noto'g'ri",
	'register.errors.verifyOtp': "Kodni tasdiqlab bo'lmadi",
	'register.errors.phoneRequired': 'Telefon raqamini kiriting',
	'register.errors.otpRequired': 'Tasdiqlash kodini kiriting',

	// RegisterField.tsx
	'register.fields.loginRequired': 'Email talab qilinadi',
	'register.fields.loginLabel': 'Loginni kiriting',
	'register.fields.loginPlaceholder': 'Loginni kiriting',
	'register.fields.passwordRequired': 'Parol talab qilinadi',
	'register.fields.passwordLabel': 'Parolni kiriting',
	'register.fields.passwordPlaceholder': 'Parolni kiriting',
	'register.fields.passwordMin': "Parol kamida 8 ta belgidan iborat bo'lishi kerak",
	'register.fields.passwordMismatch': 'Parollar mos kelmaydi',
	'register.fields.passwordShow': "Parolni ko'rsatish",
	'register.fields.passwordHide': 'Parolni yashirish',
	'register.fields.passwordRepeatRequired': 'Parolni tasdiqlang',
	'register.fields.passwordRepeatLabel': 'Parolni tasdiqlang',
	'register.fields.passwordRepeatPlaceholder': 'Parolni qayta kiriting',

	// RegisterCarrier.tsx
	'register.company.firstNameRequired': "To'liq ism talab qilinadi",
	'register.company.firstNameLabel': "To'liq ismni kiriting",
	'register.company.firstNamePlaceholder': "To'liq ismni kiriting",
	'register.company.emailLabel': 'Emailni kiriting',
	'register.company.emailPlaceholder': 'Emailni kiriting',
	'register.company.phoneRequired': 'Telefon talab qilinadi',
	'register.company.phoneLabel': 'Telefon raqamini kiriting',
	'register.company.phonePlaceholder': 'Telefon raqami',
	'register.company.countryLabel': 'Mamlakatni tanlang',
	'register.company.cityLabel': 'Shaharni tanlang',
	'register.company.cityPlaceholder': 'Shaharni tanlang',
	'register.company.companyNameRequired': 'Kompaniya nomi talab qilinadi',
	'register.company.companyNameLabel': 'Kompaniya nomini kiriting',
	'register.company.companyNamePlaceholder': 'Kompaniya nomini kiriting',
	'register.transport.label': 'Transport',
	'register.transport.placeholder': 'Transport nomini kiriting',
	'register.vehicle.transportNameLabel': 'Haydovchi transport nomini kiriting',
	'register.vehicle.transportNamePlaceholder': 'Haydovchi transport nomini kiriting',
	'register.vehicle.carNumberLabel': 'Avtomobil raqamini kiriting',
	'register.vehicle.carNumberPlaceholder': 'Avtomobil raqamini kiriting',
	'register.vehicle.trailerNumberLabel': 'Tirkama raqamini kiriting',
	'register.vehicle.trailerNumberPlaceholder': 'Tirkama raqamini kiriting',
	'register.vehicle.driverLicenseLabel': 'Haydovchilik guvohnoma raqami/seriyasini kiriting',
	'register.vehicle.driverLicensePlaceholder': 'Haydovchilik guvohnoma raqami/seriyasini kiriting',

	// useRegisterForm.ts
	'register.toast.success': "Ro'yxatdan o'tish muvaffaqiyatli yakunlandi",
	'register.toast.error': "Ro'yxatdan o'tishni yakunlab bo'lmadi",

	// register/page.tsx
	'register.meta.title': "Ro'yxatdan o'tish",
}

export default messages
