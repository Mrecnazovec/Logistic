import { Metadata } from "next";
import { LanguagePage } from "./LanguagePage";

export const metadata:Metadata = {
	title: 'Язык'
}

export default function page() {
	return <LanguagePage />
}
