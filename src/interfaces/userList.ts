export interface Filters {
  results?: number
  page?: number
  seed?: string
  include?: string[]
}

interface Name {
  first: string
  last: string
}

interface LoginData {
  uuid: string
}

interface Location {
  city: string
  country: string
}

interface Registered {
  date: string
}

export interface User {
  name: Name
  email: string
  login: LoginData
  location: Location
  registered: Registered
}
