import type { components, paths } from './api'

export type IAgreement = components['schemas']['AgreementList']
export type IPaginatedAgreementList = components['schemas']['PaginatedAgreementListList']

export type AgreementsListQuery = paths['/api/agreements/agreements/']['get'] extends {
  parameters: { query?: infer Q }
}
  ? Q
  : Record<string, never>
