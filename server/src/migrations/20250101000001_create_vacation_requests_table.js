/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  await knex.schema.createTable('vacation_requests', (table) => {
    table.increments('id').primary()
    table.integer('user_id').unsigned().notNullable()
    table.date('start_date').notNullable()
    table.date('end_date').notNullable()
    table.text('reason')
    table.enum('status', ['pending', 'approved', 'rejected']).defaultTo('pending')
    table.text('comments')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  await knex.schema.dropTableIfExists('vacation_requests')
}
