import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'movies'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.renameColumn('runtimeMinutes', 'runtime_minutes') // rename if necessary
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.renameColumn('runtimeMinutes', 'runtime_minutes') // rename if necessary
    })
  }
}
