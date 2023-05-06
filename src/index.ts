export { run } from '@oclif/core'

export { migrateDatabase } from './utils/execution'

export * from './common'
export { default as PgAdapter } from './adapters/pg'