import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'movies'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.datetime('release_date').alter()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.datetime('release_date').alter()
    })
  }
}
