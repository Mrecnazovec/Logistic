import { ArrowRight, Search, Settings2 } from "lucide-react";
import { Button } from "../Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../Dialog";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../form-control/InputGroup";

export function AddDriver() {
	return <Dialog>
		<DialogTrigger asChild>
			<Button className='bg-brand text-white' >
				Сделать предложение
			</Button>
		</DialogTrigger>

		<DialogContent className='w-[900px] lg:max-w-none rounded-3xl'>
			<DialogHeader>
				<DialogTitle className='text-center text-2xl font-bold'>
					Добавление водителя
				</DialogTitle>
			</DialogHeader>


			<div className='space-y-6'>
				<div className='flex flex-col'>
					<div className='flex justify-between gap-6 items-center border-b-2 pb-6 flex-wrap'>
						<div>
							<p>
								Ташкент, Узбекистан
							</p>
							<p>
								24 Авг, Вск
							</p>
						</div>
						<div className='flex flex-col items-center justify-center gap-3'>
							<ArrowRight className='size-5' />
							<p>450 км</p>
						</div>
						<div>
							<p>
								Фергана, Узбекистан
							</p>
							<p>
								24 Авг, Вск
							</p>
						</div>
						<div>
							<p>Тип: Контейнер</p>
							<p>Вес: 5 тонн</p>
							<p>
								Цена: 7 000 000 uzs
							</p>
							<p>(150 000 на км)</p>
						</div>
					</div>

					<div className='flex flex-col pt-6 md:flex-row gap-3'>
						<InputGroup>
							<InputGroupInput placeholder='Поиск по имени' />
							<InputGroupAddon className='pr-2'>
								<Search className='text-grayscale size-5' />
							</InputGroupAddon>
						</InputGroup>
						<Button variant={'outline'} className='bg-transparent border border-brand text-brand hover:bg-transparent hover:text-brand'>
							<Settings2 className='size-5' />
							Фильтр
						</Button>

					</div>

					<div className='flex max-md:flex-col md:justify-end gap-3 mt-6'>

						<Button className='bg-brand text-white hover:bg-brand-900 max-md:w-full max-md:order-2'>
							Поиск
						</Button>
					</div>
				</div>
			</div>
		</DialogContent>
	</Dialog>
}
