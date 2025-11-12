import { Metadata } from "next";
import { HistoryPage } from "./HistoryPage";

export const metadata: Metadata = {
	title: 'История',
}

export default function page() {
	return <HistoryPage />
}
