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

export interface User {
  name: Name
  email: string
  login: {
    uuid: string
  }
  location: {
    city: string
    country: string
  }
  registered: {
    date: string
  }
}
