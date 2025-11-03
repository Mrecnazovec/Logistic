import type { components } from './api'

export type IProfile = components['schemas']['Profile']
export type IMe = components['schemas']['Me']
export type PatchedMeDto = components['schemas']['PatchedUpdateMeRequest']
export type UpdateMeDto = components['schemas']['UpdateMeRequest']
export type RoleChangeDto = components['schemas']['RoleChangeRequest']
export type IRoleChangeResponse = components['schemas']['RoleChangeResponse']
