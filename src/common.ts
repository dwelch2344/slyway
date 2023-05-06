import { SemVer } from "semver"

export interface MigrationFile {
  prefix: string
  version?: SemVer
  file: string
  title: string,
  sql: string,
  checksum: string

  local: boolean,
  remote: boolean,
  status: 'UNINITIALIZED' | 'PENDING' | 'MIGRATED' | 'NEEDS_REPAIR' | 'NEEDS_BACKFILL' | 'MISSING' | 'UP_TO_DATE'
}

export interface MigrationResult extends MigrationFile {
  action: 'MIGRATED' | 'NO_ACTION' | 'OMITTED' | 'ERRORED',
  error?: Error
}


export interface Adapter {
  initialize(): Promise<void>
  getMigrations(): Promise<MigrationFile[]>
  migrate(...migrations: MigrationFile[]): Promise<MigrationResult[]>
  dispose(): Promise<void>
}

export interface AdapterConfig {
  schemaTable?: string,
}