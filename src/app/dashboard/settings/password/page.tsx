import { Metadata } from "next";
import { PasswordPage } from "./PasswordPage";

export const metadata: Metadata = {
	title: 'Сменить пароль'
}

export default function page() {
	return <PasswordPage />
}
