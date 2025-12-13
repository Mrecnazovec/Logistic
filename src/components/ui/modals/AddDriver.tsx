"use client"

import { ArrowRight, Search, Settings2 } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/form-control/InputGroup'

export function AddDriver() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className='bg-brand text-white'>Сделать предложение</Button>
            </DialogTrigger>

            <DialogContent className='w-[900px] lg:max-w-none'>
                <DialogHeader>
                    <DialogTitle className='text-center text-2xl font-bold'>Добавление водителя</DialogTitle>
                </DialogHeader>

                <div className='space-y-6'>
                    <div className='flex flex-col'>
                        <div className='flex flex-wrap items-center justify-between gap-6 border-b-2 pb-6'>
                            <div>
                                <p>Ташкент, Узбекистан</p>
                                <p>24 Авг, Вск</p>
                            </div>
                            <div className='flex flex-col items-center justify-center gap-3'>
                                <ArrowRight className='size-5' />
                                <p>450 км</p>
                            </div>
                            <div>
                                <p>Фергана, Узбекистан</p>
                                <p>24 Авг, Вск</p>
                            </div>
                            <div>
                                <p>Тип: Контейнер</p>
                                <p>Вес: 5 тонн</p>
                                <p>Цена: 7 000 000 UZS</p>
                                <p>(150 000 на км)</p>
                            </div>
                        </div>

                        <div className='flex flex-col gap-3 pt-6 md:flex-row'>
                            <InputGroup>
                                <InputGroupInput placeholder='Поиск по имени' />
                                <InputGroupAddon className='pr-2'>
                                    <Search className='size-5 text-grayscale' />
                                </InputGroupAddon>
                            </InputGroup>
                            <Button variant='outline' className='border border-brand bg-transparent text-brand hover:bg-transparent hover:text-brand'>
                                <Settings2 className='size-5' />
                                Фильтр
                            </Button>
                        </div>

                        <div className='mt-6 flex gap-3 max-md:flex-col md:justify-end'>
                            <Button className='bg-brand text-white hover:bg-brand-900 max-md:order-2 max-md:w-full'>Поиск</Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
