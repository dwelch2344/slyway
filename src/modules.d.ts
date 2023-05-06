declare module 'sql-migrations' {

  export const run: Run

  interface Run {
    (): void
  }

}

