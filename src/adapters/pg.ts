import * as pg from 'pg'
import { Adapter, AdapterConfig, MigrationFile, MigrationResult } from '../common'
import { SemVer, coerce } from 'semver'

export interface PgAdapterConfig extends AdapterConfig {
  host: string,
  port: number,
  database: string,
  user: string,
  password: string,
}

export const createSql = (schemaTable: string) => ({
  createTable: `
      ${ schemaTable.includes('.') ? 'create schema if not exists ' + schemaTable.split('.')[0] + ';' : '-- no schmea to create' }
      create table if not exists ${schemaTable} (
        id SERIAL,
        prefix VARCHAR,
        version VARCHAR,
        operation VARCHAR,
        file VARCHAR,
        title VARCHAR,
        sql TEXT,
        type VARCHAR,
        checksum VARCHAR,
        executed_on TIMESTAMPTZ DEFAULT transaction_timestamp()
      );
  `,
  insert: `
      insert into ${schemaTable} (
        prefix,
        version,
        operation,
        file,
        title,
        sql,
        type,
        checksum
      ) values (
        $1, -- prefix,
        $2, -- version,
        $3, -- operation,
        $4, -- file,
        $5, -- title,
        $6, -- sql,
        $7, -- type,
        $8  -- checksum
      ) returning *;
  `,
  list: `
      select 
        id, prefix, version, operation, file, 
        title, sql, type, checksum, executed_on
      from ${schemaTable}
      order by executed_on, id
  `
})

export default class PgAdapter implements Adapter {
  schemaTable: string
  acceptableStatuses = ['PENDING', 'UP_TO_DATE'] // eventually backfill?

  #client: pg.Pool
  sql: {
    createTable: string,
    insert: string,
    list: string
  }
  constructor(config: PgAdapterConfig)
  constructor(config: PgAdapterConfig, pool?: pg.Pool)
  constructor(config: PgAdapterConfig, pool?: pg.Pool) {

    if( pool == undefined ){
      pool = new pg.Pool({
        host: config.host,
        port: config.port,
        database: config.database,
        user: config.user,
        password: config.password,
      })
    }

    this.#client = pool
    this.schemaTable = config.schemaTable || 'public.schema_migration'
    this.sql = createSql(this.schemaTable)
  }

  async migrate(...migrations: MigrationFile[]): Promise<MigrationResult[]> {
    const tx = await this.#client.connect()
    const migrated: MigrationResult[] = []
    try {
      await tx.query('BEGIN')
      for(const m of migrations){
        const row = await this.runMigration(m, tx)
        
        migrated.push(row)
      }
      await tx.query('COMMIT')
      tx.release()
    }catch(err) {
      console.warn('something went wrong', err)
      await tx.query('ROLLBACK')
      throw err
    }

    return migrated
  }
  
  private async runMigration(m: MigrationFile, tx: pg.PoolClient): Promise<MigrationResult> {
    if( !this.acceptableStatuses.includes(m.status) ){
      return {
        ...m,
        action: 'OMITTED' 
      }
    }
    let operation
    switch(m.status){
      // case 'MISSING':
      //   operation = 'BACKFILL'
      //   break;
      case 'PENDING': 
        operation = 'MIGRATE'
        break;
      case 'NEEDS_REPAIR':
        operation = 'REPAIR'
        break;
      case 'UP_TO_DATE': 
        return { ...m, action: 'NO_ACTION' }
      
      default:
        throw new Error(`Unexpected migration attempt for status "${m.status}" on file: ${m.file}`)
    }
    const result = await tx.query(this.sql.insert, [
      m.prefix,
      m.version?.format(),
      operation,
      m.file,
      m.title,
      m.sql,
      m.prefix,
      m.checksum
    ])
    const row = this.parseRow(result.rows[0])
    return row
  }

  async initialize(): Promise<void> {
    // ensure created
    await this.#client.query(this.sql.createTable)
  }

  async getMigrations(): Promise<MigrationFile[]> {
    const results = await this.#client.query(this.sql.list)
    return results.rows.map(this.parseRow)
  }

  protected parseRow(row: any): MigrationResult{
    return {
      file: row.file, 
      prefix: row.prefix, 
      version: coerce(row.version) as SemVer, 
      title: row.title, 
      local: false,
      remote: true, 
      sql: row.sql, 
      checksum: row.checksum, 
      status: 'MIGRATED',
      action: 'MIGRATED'
    }
  }

  dispose(): Promise<void> {
    return this.#client.end()
  }
}