import { Metadata } from "next";
import { RatingPage } from "./RatingPage";

export const metadata: Metadata = {
	title: 'Рейтинг',
}

export default function page() {
	return <RatingPage />
}
