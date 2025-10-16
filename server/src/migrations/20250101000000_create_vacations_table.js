/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  await knex.schema.createTable('vacations', (table) => {
    table.increments('id').primary()
    table.string('employee_name').notNullable()
    table.string('employee_email').notNullable()
    table.date('start_date').notNullable()
    table.date('end_date').notNullable()
    table.integer('days_requested').notNullable()
    table.enum('status', ['pending', 'approved', 'rejected']).defaultTo('pending')
    table.text('notes')
    table.timestamps(true, true)
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  await knex.schema.dropTableIfExists('vacations')
}
