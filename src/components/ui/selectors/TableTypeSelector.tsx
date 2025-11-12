'use client'

import { cn } from "@/lib/utils";
import Cookies from 'js-cookie';
import { LayoutGrid, Table } from "lucide-react";
import { useEffect } from "react";
import { Button } from "../Button";
import { TableType, useTableTypeStore } from "@/store/useTableTypeStore";

const DEFAULT_TABLE_TYPE: TableType = 'table';

export function TableTypeSelector() {
	const tableType = useTableTypeStore((state) => state.tableType);
	const setTableType = useTableTypeStore((state) => state.setTableType);

	useEffect(() => {
		const storedType = Cookies.get('table_type');
		if (storedType === 'card' || storedType === 'table') {
			setTableType(storedType);
		} else {
			Cookies.set('table_type', DEFAULT_TABLE_TYPE);
			setTableType(DEFAULT_TABLE_TYPE);
		}
	}, [setTableType]);

	const handleSelect = (nextType: TableType) => {
		if (nextType === tableType) return;
		setTableType(nextType);
		Cookies.set('table_type', nextType);
	};

	return <div className="grid grid-cols-2 w-fit bg-background rounded-4xl py-1 px-3 gap-1">
		<Button
			onClick={() => handleSelect('card')}
			variant={'link'}
			aria-pressed={tableType === 'card'}
			className={cn("p-2 h-fit w-fit", tableType === 'card' && 'bg-brand/10 text-brand')}
		>
			<LayoutGrid className="size-6" aria-hidden />
			<span className="sr-only">Card view</span>
		</Button>
		<Button
			onClick={() => handleSelect('table')}
			variant={'link'}
			aria-pressed={tableType === 'table'}
			className={cn("p-2 h-fit w-fit", tableType === 'table' && 'bg-brand/10 text-brand')}
		>
			<Table className="size-6" aria-hidden />
			<span className="sr-only">Table view</span>
		</Button>
	</div>
}
