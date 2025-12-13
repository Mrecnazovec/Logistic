import type { components } from './api'

export type ICargoListBase = components['schemas']['CargoList']
export interface ICargoList extends ICargoListBase {
	is_hidden?: boolean
}
