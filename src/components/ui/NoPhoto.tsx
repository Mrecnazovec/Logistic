import { cn } from "@/lib/utils";
import { User } from "lucide-react";

interface INoUser {
	className?: string
}

export function NoPhoto({ className }: INoUser) {


	return <div className={cn('rounded-full bg-brand/20 centred xs:size-9 size-7', className)}>
		<User className='w-3/4 h-3/4 text-brand' />
	</div>
}
