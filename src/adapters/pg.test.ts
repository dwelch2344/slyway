
import PgAdapter from './pg'

describe('Test PG adapter', () => {
  it('hi', async () => {
    const pga = new PgAdapter({
      host: 'localhost',
      port: 5405,
      db: 'hubspot',
      user: 'dbadmin',
      password: 'changeme',
    })

    const result = await pga.initialize()
    console.log('wtf', result)
  })
})