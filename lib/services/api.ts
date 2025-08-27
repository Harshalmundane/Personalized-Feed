import type { ContentItem } from "../slices/contentSlice"

const API_BASE_URL = process.env.NODE_ENV === "production" ? "https://your-domain.com/api" : "/api"

export interface ApiResponse<T> {
  items: T[]
  page: number
  hasMore: boolean
  total: number
}

export interface SearchResponse extends ApiResponse<ContentItem> {
  query: string
}

class ApiService {
  private async fetchWithRetry<T>(url: string, options: RequestInit = {}, retries = 3): Promise<T> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            "Content-Type": "application/json",
            ...options.headers,
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        return await response.json()
      } catch (error) {
        if (i === retries - 1) throw error
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)))
      }
    }
    throw new Error("Max retries exceeded")
  }

  async fetchNews(categories: string[], page = 1, limit = 10): Promise<ApiResponse<ContentItem>> {
    const params = new URLSearchParams({
      categories: categories.join(","),
      page: page.toString(),
      limit: limit.toString(),
    })

    return this.fetchWithRetry<ApiResponse<ContentItem>>(`${API_BASE_URL}/news?${params}`)
  }

  async fetchRecommendations(categories: string[], page = 1, limit = 8): Promise<ApiResponse<ContentItem>> {
    const params = new URLSearchParams({
      categories: categories.join(","),
      page: page.toString(),
      limit: limit.toString(),
    })

    return this.fetchWithRetry<ApiResponse<ContentItem>>(`${API_BASE_URL}/recommendations?${params}`)
  }

  async fetchSocialPosts(hashtags: string[], page = 1, limit = 12): Promise<ApiResponse<ContentItem>> {
    const params = new URLSearchParams({
      hashtags: hashtags.join(","),
      page: page.toString(),
      limit: limit.toString(),
    })

    return this.fetchWithRetry<ApiResponse<ContentItem>>(`${API_BASE_URL}/social?${params}`)
  }

  async searchContent(query: string, type = "all", page = 1, limit = 20): Promise<SearchResponse> {
    const params = new URLSearchParams({
      q: query,
      type,
      page: page.toString(),
      limit: limit.toString(),
    })

    return this.fetchWithRetry<SearchResponse>(`${API_BASE_URL}/search?${params}`)
  }

  // Cache management
  private cache = new Map<string, { data: any; timestamp: number }>()
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  async fetchWithCache<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data
    }

    const data = await fetchFn()
    this.cache.set(key, { data, timestamp: Date.now() })
    return data
  }

  clearCache(): void {
    this.cache.clear()
  }
}

export const apiService = new ApiService()
