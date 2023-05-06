import { Adapter } from "../common"
import Migrator from "./migrator"


export const migrateDatabase = async (dir: string | undefined, adapter: Adapter) => {
  await adapter.initialize()
  const m = new Migrator({ migrationsDir: dir}, adapter)
  await m.initialize()
  const migrations = await adapter.migrate(...m.migrations)
  return migrations
}