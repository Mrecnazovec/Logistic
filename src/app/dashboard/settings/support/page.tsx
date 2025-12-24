import { Metadata } from "next";
import { SupportPage } from "./SupportPage";

export const metadata: Metadata = {
	title: 'Поддержка'
}

export default function page() {
	return <SupportPage />
}
