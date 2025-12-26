const messages: Record<string, string> = {
	// AuthPage.tsx
	'auth.signUp': 'Зарегистрироваться',
	'auth.signIn': 'Авторизоваться',
	'auth.title': 'Вход в аккаунт',
	'auth.submit': 'Войти',
	'auth.hero': 'Высококачественное программное решение для управления вашим бизнес-процессом',

	// AuthField.tsx
	'auth.fields.loginRequired': 'Логин обязателен',
	'auth.fields.loginLabel': 'Введите логин',
	'auth.fields.loginPlaceholder': 'Введите email',
	'auth.fields.passwordRequired': 'Пароль обязателен',
	'auth.fields.passwordLabel': 'Введите пароль',
	'auth.fields.passwordPlaceholder': 'Введите пароль',
	'auth.fields.rememberMe': 'Запомнить меня',
	'auth.fields.forgotPassword': 'Забыли пароль?',

	// useAuthForm.ts
	'auth.toast.success': 'Успешная авторизация',
	'auth.toast.error': 'Ошибка при авторизации',

	// auth/page.tsx
	'auth.meta.title': 'Авторизация',

	// RegisterPage.tsx
	'register.title': 'Регистрация',
	'register.companyInfo': 'Информация о компании',
	'register.confirmation': 'Подтверждение',
	'register.welcomeTitle': 'Добро пожаловать в {siteName}!',
	'register.welcomeSubtitle': 'Пожалуйста, выберите вашу роль для регистрации',
	'register.otpSent': 'Мы только что отправили проверочный код на {phone}',
	'register.yourPhone': 'ваш телефон',
	'register.resendIn': 'Через {time} можно отправить код еще раз',
	'register.resendCode': 'Отправить код еще раз',
	'register.phoneVerified': 'Номер телефона подтвержден, вы можете завершить регистрацию.',
	'register.finish': 'Зарегистрироваться',
	'register.role.customer.title': 'Грузовладелец',
	'register.role.customer.description': 'Компания или человек, которому нужно что-то перевезти, хранить или обработать.',
	'register.role.customer.button': 'грузовладелец',
	'register.role.carrier.title': 'Перевозчик',
	'register.role.carrier.description':
		'Исполнитель в логистике. Его задача - взять груз у заказчика и доставить его из точки А в точку Б в сохранности и в срок.',
	'register.role.carrier.button': 'перевозчик',
	'register.role.logistic.title': 'Экспедитор',
	'register.role.logistic.description':
		'Специалист, который организует и управляет процессом перемещения и хранения товаров, чтобы груз дошел вовремя и с минимальными затратами.',
	'register.role.logistic.button': 'экспедитор',
	'register.role.cta': 'Зарегистрироваться как',
	'register.role.dialogTitle': 'Кем вы являетесь?',
	'register.errors.sendOtp': 'Не удалось отправить код подтверждения',
	'register.errors.invalidOtp': 'Код подтверждения неверный',
	'register.errors.verifyOtp': 'Не удалось подтвердить код',
	'register.errors.phoneRequired': 'Введите номер телефона',
	'register.errors.otpRequired': 'Введите код подтверждения',

	// RegisterField.tsx
	'register.fields.loginRequired': 'Почта обязательна',
	'register.fields.loginLabel': 'Введите логин',
	'register.fields.loginPlaceholder': 'Введите логин',
	'register.fields.passwordRequired': 'Пароль обязателен',
	'register.fields.passwordLabel': 'Введите пароль',
	'register.fields.passwordPlaceholder': 'Введите пароль',
	'register.fields.passwordRepeatRequired': 'Подтвердите пароль',
	'register.fields.passwordRepeatLabel': 'Подтвердите пароль',
	'register.fields.passwordRepeatPlaceholder': 'Повторите пароль',

	// RegisterCarrier.tsx
	'register.company.firstNameRequired': 'Ф.И.О. обязательно',
	'register.company.firstNameLabel': 'Введите Ф.И.О.',
	'register.company.firstNamePlaceholder': 'Введите Ф.И.О.',
	'register.company.emailLabel': 'Введите email',
	'register.company.emailPlaceholder': 'Введите email',
	'register.company.phoneRequired': 'Телефон обязателен',
	'register.company.phoneLabel': 'Введите номер',
	'register.company.phonePlaceholder': 'Номер телефона',
	'register.company.countryLabel': 'Выберите страну',
	'register.company.cityLabel': 'Выберите город',
	'register.company.cityPlaceholder': 'Выберите город',
	'register.company.companyNameRequired': 'Название компании обязательно',
	'register.company.companyNameLabel': 'Введите название компании',
	'register.company.companyNamePlaceholder': 'Введите название компании',
	'register.transport.label': 'Транспорт',
	'register.transport.placeholder': 'Введите название транспорта',
	'register.vehicle.transportNameLabel': 'Введите название машины перевозчика',
	'register.vehicle.transportNamePlaceholder': 'Введите название машины перевозчика',
	'register.vehicle.carNumberLabel': 'Введите номер машины',
	'register.vehicle.carNumberPlaceholder': 'Введите номер машины',
	'register.vehicle.trailerNumberLabel': 'Введите номер прицепа',
	'register.vehicle.trailerNumberPlaceholder': 'Введите номер прицепа',
	'register.vehicle.driverLicenseLabel': 'Введите номер/серию водительского удостоверения',
	'register.vehicle.driverLicensePlaceholder': 'Введите номер/серию водительского удостоверения',

	// useRegisterForm.ts
	'register.toast.success': 'Регистрация прошла успешно',
	'register.toast.error': 'Не удалось завершить регистрацию',

	// register/page.tsx
	'register.meta.title': 'Регистрация',
}

export default messages
