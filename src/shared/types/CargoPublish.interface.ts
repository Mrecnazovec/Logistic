import type { components } from './api'

type BaseCargoPublish = components['schemas']['CargoPublish']
type BaseCargoPublishRequest = components['schemas']['CargoPublishRequest']
type BasePatchedCargoPublish = components['schemas']['PatchedCargoPublishRequest']

export interface ICargoPublish extends BaseCargoPublish {
	is_hidden?: boolean
}

export interface CargoPublishRequestDto extends BaseCargoPublishRequest {
	is_hidden: boolean
}

export interface PatchedCargoPublishDto extends BasePatchedCargoPublish {
	is_hidden?: boolean
}
