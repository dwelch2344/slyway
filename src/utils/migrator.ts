
import fs = require('fs')
import mkdirp = require('mkdirp')
import path = require('path')
import { Adapter, MigrationFile } from '../common'
import FileScanner from './files'

interface MigratorConfig {
  migrationsDir: string
}

export default class Migrator {
  #config: MigratorConfig
  fileScanner: FileScanner
  
  // migrated: MigrationFile[] = []
  // versioned: MigrationFile[] = []
  // repeatable: MigrationFile[] = []
  // locals: MigrationFile[] = []

  migrations: MigrationFile[] = []
  
  constructor(cfg: Partial<MigratorConfig> = {}, private adapter: Adapter) {
    this.#config = Object.assign({
      ...cfg, 
      migrationsDir: cfg.migrationsDir || path.resolve(process.cwd(), 'db/migrations/'),
    })
    this.fileScanner = new FileScanner(this.config.migrationsDir)
  }

  get config() {
    return this.#config
  }

  async initialize(){
    // get the local files
    const locals = await this.fileScanner.scan()

    const versioned = locals.filter(l => l.prefix === 'V')
    const repeatable = locals.filter(l => l.prefix === 'R')


    const migrated = await this.adapter.getMigrations()

    this.handleMigrated(migrated, versioned)

    // everything left over locally is pending 
    versioned.forEach(m => {
      m.status = 'PENDING'
      this.migrations.push(m)
    })

    this.sort()

    // look for gaps and backfills
    // (must run before REPEATABLES)
    this.handleBackfills()
    

    this.handleRepeatable(repeatable, migrated)

  }
  
  handleMigrated(migrated: MigrationFile[], versioned: MigrationFile[]) {
    // TODO: probably filter based on applied or something?
    const versionedFiles = migrated.filter(m => m.prefix === 'V') 
    for(const m of versionedFiles.reverse()){
      let v = versioned.find(el => el.file === m.file)
      if( v ){
        v.remote = true
        if( v.checksum !== m.checksum ){
          v.status = 'NEEDS_REPAIR'
        }else{
          v.status = m.status
        }
        this.migrations.push(v)
        versioned.splice(versioned.indexOf(v), 1)
      }else{
        // local is missing this
        m.status = 'MISSING'
        this.migrations.push(m)
      }
    }
  }

  sort() {
    this.migrations.sort( (a, b) => {
      if( a.version && !b.version ){
        return 1
      }
      if( b.version && !a.version ){
        return -1
      }
      return a.version?.compare(b.version!) as number
    })
  }

  handleBackfills() {
    this.migrations.forEach((m, idx) => {
      if( m.status != 'PENDING' ){
        return
      }
      const completedAfter = [...this.migrations].splice(idx + 1, this.migrations.length)
      if( completedAfter.filter(m => m.status === 'MIGRATED').length > 0 ){
        m.status = 'NEEDS_BACKFILL'
      }
    })

    // TODO: make backfills conditional
    const backfills = this.migrations.filter(m => m.status === 'NEEDS_BACKFILL')
    if( backfills.length ) {
      throw new Error('Backfills currently unsupported for following files: ' + backfills.map(m => m.file).join(', '))
    }
  }
  
  handleRepeatable(repeatable: MigrationFile[], alreadyMigrated: MigrationFile[]) {
    const backwards = [...alreadyMigrated].reverse()
    repeatable
      .sort((a, b) => a.file.localeCompare(b.file))
      .forEach(m => {
        const last = backwards.find(e => e.file === m.file)
        if( last ){
          if( last.checksum === m.checksum ){
            m.status = 'UP_TO_DATE'
          }
        }
        // only set it to pending it's uninitialized?
        m.status = m.status === 'UNINITIALIZED' ? 'PENDING' : m.status
        this.migrations.push(m)
      })
  }

}
