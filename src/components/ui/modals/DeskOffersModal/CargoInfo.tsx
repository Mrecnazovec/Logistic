"use client"

import { ArrowRight } from "lucide-react"

import type { CargoInfo as CargoInfoType } from "./types"

type CargoInfoProps = {
  cargoInfo: CargoInfoType
}

export function CargoInfo({ cargoInfo }: CargoInfoProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-6 border-b pb-6">
      <div>
        <p className="font-semibold text-foreground">{cargoInfo.origin}</p>
        <p className="text-sm text-muted-foreground">{cargoInfo.originDate}</p>
      </div>
      <div className="flex flex-col items-center justify-center text-sm font-semibold text-muted-foreground">
        <ArrowRight className="mb-1 size-5" />
        {cargoInfo.route_km}
      </div>
      <div>
        <p className="font-semibold text-foreground">{cargoInfo.destination}</p>
        <p className="text-sm text-muted-foreground">{cargoInfo.destinationDate}</p>
      </div>
      <div className="space-y-1 text-sm text-muted-foreground">
        <p>
          <span className="font-semibold text-foreground">Тип транспорта: </span>
          {cargoInfo.transport}
        </p>
        <p>
          <span className="font-semibold text-foreground">Вес: </span>
          {cargoInfo.weight}
        </p>
        <p>
          <span className="font-semibold text-foreground">Начальная цена: </span>
          {cargoInfo.initialPrice}
        </p>
      </div>
    </div>
  )
}
