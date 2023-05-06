
import * as fs from 'fs'
import * as path from 'path'
import * as crypto from 'crypto'
import {SemVer, coerce, Comparator} from 'semver'
import { MigrationFile } from '../common'

export interface MigrationComparator {
  (a: MigrationFile, b: MigrationFile): number
}

export default class FileScanner {
  static regex = /([RV|])(\d*|\d\.\d+)__(.*).sql/

  constructor(private baseDir: string) {}

  async readDir() {
    const files: string[] = fs.readdirSync(this.baseDir)
    return files.map(filename => ({
      filename, file: path.resolve(this.baseDir, filename)
    }))
  }

  async scan() {
    const files = await this.readDir()
    const matches: MigrationFile[] = []

    await Promise.all(files.map(({ filename, file }) => 
      new Promise<void>( async (resolve, reject) => {
        try { 
            // eslint-disable-next-line unicorn/better-regex
          const matched = FileScanner.regex.exec(filename)
          if (!matched) {
            return resolve()
          }

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const [_, prefix, versionStr, title] = matched
          const hasVersion = (versionStr || versionStr.trim().length > 0)
          if (!hasVersion && prefix !== 'R') {
            return reject(new Error(`Invalid Version "${versionStr} for file: ${filename}"`))
          }

          const version = hasVersion ? coerce(versionStr)! : undefined
          const sql = await fs.promises.readFile(file, 'utf-8')
          const hashSum = crypto.createHash('sha256');
          hashSum.update(sql);
          const checksum = hashSum.digest('hex');

          matched && matches.push({file: filename, prefix, version, title, local: true, remote: false, sql, checksum, status: 'UNINITIALIZED' })

          resolve()
        }catch(err){
          reject(err)
        }
      })
    ))
    matches.sort(this.comparator)
    return matches
  }

  comparator: MigrationComparator = (a, b) => {
    if (a.prefix !== b.prefix) {
      if (a.prefix === 'V') {
        return -1
      }

      return 1
    }

    return a.file.localeCompare(b.file)
  }
}
