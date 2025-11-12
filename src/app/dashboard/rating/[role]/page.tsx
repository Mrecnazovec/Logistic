import { Metadata } from "next";
import { Rating } from "./Rating";

export const metadata: Metadata = {
	title: 'Рейтинг',
}

export default function page() {
	return <Rating />
}
