import { LayoutGrid, Table } from "lucide-react";
import { Button } from "../Button";

export function TableTypeSelector() {
	
	return <div className="grid grid-cols-2 w-fit bg-background rounded-4xl py-1 px-3">
		<Button variant={'ghost'} className="p-2">
			<LayoutGrid className="size-6" />
		</Button>
		<Button variant={'ghost'} className="p-2">
			<Table className="size-6" />
		</Button>
	</div>
}
