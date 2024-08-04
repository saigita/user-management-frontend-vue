export class HttpService {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  }

  private constructUrl = (endpoint: string, params?: Record<string, any>): string => {
    // need to handle null and undefined param values
    const queryString = new URLSearchParams(params).toString()
    return queryString ? `${this.baseUrl}${endpoint}?${queryString}` : `${this.baseUrl}${endpoint}`
  }

  public async get<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    const apiUrl = this.constructUrl(endpoint, params)
    return this.request<T>(apiUrl)
  }

  public async post<T>(endpoint: string, data: any): Promise<T> {
    const apiUrl = this.constructUrl(endpoint)
    return this.request<T>(apiUrl, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }
}

export const httpService = new HttpService(import.meta.env.VITE_API_BASE_URL)
