import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, belongsTo } from '@adonisjs/lucid/orm'
import Movie from './movie.js'
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Watchlist extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare movieId: number

  @belongsTo(() => Movie)
  declare movie: BelongsTo<typeof Movie>

  // @hasMany(() => Movie)
  // declare movie: HasMany<typeof Movie>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
