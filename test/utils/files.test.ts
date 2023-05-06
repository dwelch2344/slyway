import {expect, test} from '@oclif/test'

import FileScanner from './files'

describe('create migration', () => {
  it('hi', async () => {
    const validNames = [
      'R__No Version.sql',
      'R3__Repeat 3.sql',
      'R1__Repeat_1.sql',
      'R2__Repeat2.sql',
      'V1__first version.sql',
      'V1.1__got 1.1.sql',
      'V2.2__got 2.1.sql',
      'V1.3__got 1.1.sql',
    ]

    const invalidNames = [
      'Booger__foo',
      'V1.__foobar',
    ]

    const scanner = new FileScanner('')
    scanner.readDir = async () => [...validNames, ...invalidNames]
    const matches = await scanner.scan()
    expect(matches.length).equals(validNames.length)
  })
})