/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export const seed = async (knex) => {
  // Deletes ALL existing entries
  await knex('vacations').del()
  
  // Inserts seed entries
  await knex('vacations').insert([
    {
      employee_name: 'John Doe',
      employee_email: 'john.doe@example.com',
      start_date: '2025-11-01',
      end_date: '2025-11-05',
      days_requested: 5,
      status: 'approved',
      notes: 'Family vacation'
    },
    {
      employee_name: 'Jane Smith',
      employee_email: 'jane.smith@example.com',
      start_date: '2025-12-20',
      end_date: '2025-12-31',
      days_requested: 12,
      status: 'pending',
      notes: 'Holiday break'
    },
    {
      employee_name: 'Bob Johnson',
      employee_email: 'bob.johnson@example.com',
      start_date: '2025-10-10',
      end_date: '2025-10-12',
      days_requested: 3,
      status: 'approved',
      notes: 'Long weekend'
    }
  ])
}
