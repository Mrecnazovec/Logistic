import { Metadata } from "next";
import { Rating } from "./[role]/Rating";

export const metadata: Metadata = {
	title: 'Рейтинг',
}

export default function page() {
	return <Rating />
}
