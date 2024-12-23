import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Rating from './rating.js'

export default class Movie extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare primaryImage: string

  @column()
  declare description: string

  @column()
  declare cast: string

  @column()
  declare release_date: Date

  @column()
  declare avg_rating: number | 0

  @column()
  declare runtimeMinutes: number

  @column()
  declare type: string

  // @hasMany(() => Rating)
  // declare ratings: HasMany<typeof Rating>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
