import {Command, Flags, CliUx } from '@oclif/core'
import PgAdapter from '../adapters/pg'
import Migrator from '../utils/migrator'
import { migrateDatabase } from '../utils/execution'

export default class Migrate extends Command {
  static description = 'Migrate your database'

  static examples = [
    // '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    // flag with a value (-n, --name=VALUE)
    // name: Flags.string({char: 'n', description: 'name to print'}),
    // dir: Flags.file({char: 'd', description: 'Directory to migrate'}),
    host: Flags.string({char: 'h', description: 'host', required: true}),
    port: Flags.integer({char: 'p', description: 'port', required: true}),
    db: Flags.string({char: 'd', description: 'port', required: true}),
    user: Flags.string({char: 'u', description: 'user', required: true}),

    // flag with no value (-f, --force)
    force: Flags.boolean({char: 'f'}),
  }

  static args = [ { name: 'dir' } ]

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Migrate)

    const password = process.env.SLYWAY_PASSWORD || await CliUx.ux.prompt('password', { type: "mask" })

    // support more adapters
    const adapter = new PgAdapter({
      host: flags.host,
      port: flags.port,
      database: flags.db,
      user: flags.user,
      password,
    })
    let migrations
    try {
      migrations = await migrateDatabase(args.dir, adapter)
      await adapter.dispose()
    }finally {
      if( migrations ){
        migrations.forEach(m => {
          console.log(` [${m.action}]\t ${m.file} [${m.status}]`)
        })
      }
    }
    
  }
}
