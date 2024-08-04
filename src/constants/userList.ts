import type { Column } from '@/interfaces/common'

export const USER_COLUMNS: Column[] = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'location', label: 'Location' },
  { key: 'registered_date', label: 'Registered Date' }
]

export const INCLUDE_FILTER = ['name', 'email', 'location', 'registered', 'login']
