import { Suspense } from "react";
import { OrderPage } from "./OrderPage";

export default function page() {
	return <Suspense>
		<OrderPage />
	</Suspense>
}
