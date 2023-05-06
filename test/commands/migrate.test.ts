import { CliUx } from '@oclif/core'
import {expect, test} from '@oclif/test'

describe('run migration', () => {
  test
    .stdout({print: true})
    .command('migrate -h localhost -p 5405 -d postgres -u postgres'.split(' '))
    .stub(CliUx.ux, 'prompt', async () => 'root_pg_password\n')
    
    .stdout()
    .hook('init')
    // .stdin('root_pg_password\n')
    .it('force migration', ctx => {
      expect(ctx.stdout).to.contain('migrations')
    })
})
