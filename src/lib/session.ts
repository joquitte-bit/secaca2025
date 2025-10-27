import { cookies } from 'next/headers'

export interface User {
  id: string
  email: string
  name: string
  role: string
}

// Simpele sessie helper voor development
export async function getCurrentUser(): Promise<User | null> {
  try {
    // Return demo user die overeenkomt met seed data
    return {
      id: 'cmh8laluq0000874a2abur4m2-user', // Gebruiker ID uit seed
      email: 'gebruiker@demo-bedrijf.nl',
      name: 'Demo Gebruiker',
      role: 'LEARNER'
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}