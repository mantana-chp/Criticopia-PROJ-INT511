import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'movies'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title', 255).notNullable()
      table.text('primary_image').notNullable() //img url
      table.text('description').notNullable()
      table.text('cast').notNullable()
      table.date('release_date').notNullable()
      table.float('avg_rating').defaultTo(0)
      table.integer('runtime_minutes').notNullable()
      table.string('type').notNullable() // Movie or TV Show

      table.index('title') // Index for faster search

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
