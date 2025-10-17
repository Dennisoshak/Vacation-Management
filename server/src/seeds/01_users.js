/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export const seed = async (knex) => {
  // Deletes ALL existing entries
  await knex('users').del()
  
  // Inserts seed entries
  await knex('users').insert([
    { id: 1, name: 'Avi Cohen', role: 'requester' },
    { id: 2, name: 'Anat Levy', role: 'requester' },
    { id: 3, name: 'Bob Green', role: 'requester' },
    { id: 4, name: 'Daniel HR', role: 'validator' },
    { id: 5, name: 'Neta Admin', role: 'validator' }
  ])
}
