import { Loader2 } from "lucide-react";

export function Loader() {
	return <div className='bg-background rounded-4xl flex items-center justify-center h-full'>
		<Loader2 className='size-10 animate-spin' />
	</div>
}
