import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { apiService } from "../services/api"

export interface ContentItem {
  id: string
  type: "news" | "recommendation" | "social"
  title: string
  description: string
  imageUrl?: string
  url?: string
  category: string
  publishedAt: string
  source: string
  isFavorite?: boolean
}

export interface ContentFilters {
  contentType: string
  categories: string[]
  dateRange: string
}

export interface AdvancedSearchFilters {
  query: string
  exactPhrase: string
  excludeWords: string[]
  contentTypes: string[]
  categories: string[]
  sources: string[]
  dateFrom: string
  dateTo: string
  sortBy: string
}

export interface ContentState {
  items: ContentItem[]
  filteredItems: ContentItem[]
  loading: boolean
  error: string | null
  searchQuery: string
  currentPage: number
  hasMore: boolean
  trendingItems: ContentItem[]
  filters: ContentFilters
  sortBy: string
  searchHistory: string[]
  trendingSearches: string[]
  advancedSearch: AdvancedSearchFilters | null
}

const initialState: ContentState = {
  items: [],
  filteredItems: [],
  loading: false,
  error: null,
  searchQuery: "",
  currentPage: 1,
  hasMore: true,
  trendingItems: [],
  filters: {
    contentType: "all",
    categories: [],
    dateRange: "all",
  },
  sortBy: "newest",
  searchHistory: [],
  trendingSearches: ["technology trends", "sports news", "finance updates", "health tips", "entertainment buzz"],
  advancedSearch: null,
}

export const fetchNews = createAsyncThunk(
  "content/fetchNews",
  async ({ categories, page = 1 }: { categories: string[]; page?: number }) => {
    const response = await apiService.fetchNews(categories, page)
    return response
  },
)

export const fetchRecommendations = createAsyncThunk(
  "content/fetchRecommendations",
  async ({ categories, page = 1 }: { categories: string[]; page?: number }) => {
    const response = await apiService.fetchRecommendations(categories, page)
    return response
  },
)

export const fetchSocialPosts = createAsyncThunk(
  "content/fetchSocialPosts",
  async ({ hashtags, page = 1 }: { hashtags: string[]; page?: number }) => {
    const response = await apiService.fetchSocialPosts(hashtags, page)
    return response
  },
)

export const searchContent = createAsyncThunk(
  "content/searchContent",
  async ({ query, type = "all", page = 1 }: { query: string; type?: string; page?: number }) => {
    const response = await apiService.searchContent(query, type, page)
    return response
  },
)

const applyAdvancedSearch = (items: ContentItem[], advancedFilters: AdvancedSearchFilters) => {
  let filtered = [...items]

  // Apply query search
  if (advancedFilters.query.trim()) {
    const query = advancedFilters.query.toLowerCase()
    filtered = filtered.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query),
    )
  }

  // Apply exact phrase search
  if (advancedFilters.exactPhrase.trim()) {
    const phrase = advancedFilters.exactPhrase.toLowerCase()
    filtered = filtered.filter(
      (item) => item.title.toLowerCase().includes(phrase) || item.description.toLowerCase().includes(phrase),
    )
  }

  // Exclude words
  if (advancedFilters.excludeWords.length > 0) {
    filtered = filtered.filter((item) => {
      const text = `${item.title} ${item.description}`.toLowerCase()
      return !advancedFilters.excludeWords.some((word) => text.includes(word.toLowerCase()))
    })
  }

  // Filter by content types
  if (advancedFilters.contentTypes.length > 0) {
    filtered = filtered.filter((item) => advancedFilters.contentTypes.includes(item.type))
  }

  // Filter by categories
  if (advancedFilters.categories.length > 0) {
    filtered = filtered.filter((item) => advancedFilters.categories.includes(item.category))
  }

  // Filter by sources
  if (advancedFilters.sources.length > 0) {
    filtered = filtered.filter((item) => advancedFilters.sources.includes(item.source))
  }

  // Filter by date range
  if (advancedFilters.dateFrom || advancedFilters.dateTo) {
    filtered = filtered.filter((item) => {
      const itemDate = new Date(item.publishedAt)
      const fromDate = advancedFilters.dateFrom ? new Date(advancedFilters.dateFrom) : new Date(0)
      const toDate = advancedFilters.dateTo ? new Date(advancedFilters.dateTo) : new Date()
      return itemDate >= fromDate && itemDate <= toDate
    })
  }

  // Apply sorting
  filtered.sort((a, b) => {
    switch (advancedFilters.sortBy) {
      case "newest":
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      case "oldest":
        return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
      case "relevance":
        // Enhanced relevance scoring for advanced search
        let aScore = 0
        let bScore = 0

        if (advancedFilters.query.trim()) {
          const query = advancedFilters.query.toLowerCase()
          if (a.title.toLowerCase().includes(query)) aScore += 3
          if (a.description.toLowerCase().includes(query)) aScore += 1
          if (b.title.toLowerCase().includes(query)) bScore += 3
          if (b.description.toLowerCase().includes(query)) bScore += 1
        }

        return bScore - aScore
      case "popular":
        const typeOrder = { social: 3, news: 2, recommendation: 1 }
        return typeOrder[b.type] - typeOrder[a.type]
      default:
        return 0
    }
  })

  return filtered
}

const applyFiltersAndSort = (items: ContentItem[], filters: ContentFilters, sortBy: string, searchQuery: string) => {
  let filtered = [...items]

  // Handle search operators
  const operatorRegex = /(type|source):(\w+)/g
  const operators: { [key: string]: string[] } = {}
  let cleanQuery = searchQuery

  let match
  while ((match = operatorRegex.exec(searchQuery)) !== null) {
    const [fullMatch, operator, value] = match
    if (!operators[operator]) operators[operator] = []
    operators[operator].push(value)
    cleanQuery = cleanQuery.replace(fullMatch, "").trim()
  }

  // Apply operator filters
  if (operators.type) {
    filtered = filtered.filter((item) => operators.type.includes(item.type))
  }
  if (operators.source) {
    filtered = filtered.filter((item) =>
      operators.source.some((source) => item.source.toLowerCase().includes(source.toLowerCase())),
    )
  }

  // Apply content type filter
  if (filters.contentType !== "all") {
    filtered = filtered.filter((item) => item.type === filters.contentType)
  }

  // Apply category filter
  if (filters.categories.length > 0) {
    filtered = filtered.filter((item) => filters.categories.includes(item.category))
  }

  // Apply date range filter
  if (filters.dateRange !== "all") {
    const now = new Date()
    const filterDate = new Date()

    switch (filters.dateRange) {
      case "today":
        filterDate.setHours(0, 0, 0, 0)
        break
      case "week":
        filterDate.setDate(now.getDate() - 7)
        break
      case "month":
        filterDate.setMonth(now.getMonth() - 1)
        break
      case "year":
        filterDate.setFullYear(now.getFullYear() - 1)
        break
    }

    if (filters.dateRange !== "all") {
      filtered = filtered.filter((item) => new Date(item.publishedAt) >= filterDate)
    }
  }

  // Apply search query (cleaned of operators)
  if (cleanQuery.trim()) {
    const query = cleanQuery.toLowerCase()
    filtered = filtered.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query),
    )
  }

  // Apply sorting
  filtered.sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      case "oldest":
        return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
      case "relevance":
        if (cleanQuery.trim()) {
          const aScore = a.title.toLowerCase().includes(cleanQuery.toLowerCase()) ? 2 : 1
          const bScore = b.title.toLowerCase().includes(cleanQuery.toLowerCase()) ? 2 : 1
          return bScore - aScore
        }
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      case "popular":
        const typeOrder = { social: 3, news: 2, recommendation: 1 }
        return typeOrder[b.type] - typeOrder[a.type]
      default:
        return 0
    }
  })

  return filtered
}

const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
      state.advancedSearch = null // Clear advanced search when using simple search
      state.filteredItems = applyFiltersAndSort(state.items, state.filters, state.sortBy, action.payload)
    },
    setAdvancedSearch: (state, action: PayloadAction<AdvancedSearchFilters>) => {
      state.advancedSearch = action.payload
      state.searchQuery = "" // Clear simple search when using advanced search
      state.filteredItems = applyAdvancedSearch(state.items, action.payload)
    },
    addSearchHistory: (state, action: PayloadAction<string>) => {
      const query = action.payload.trim()
      if (query && !state.searchHistory.includes(query)) {
        state.searchHistory = [query, ...state.searchHistory.slice(0, 9)] // Keep last 10 searches
      }
    },
    clearSearchHistory: (state) => {
      state.searchHistory = []
    },
    setContentFilter: (state, action: PayloadAction<{ type: keyof ContentFilters; value: any }>) => {
      const { type, value } = action.payload
      state.filters[type] = value as never
      if (state.advancedSearch) {
        state.filteredItems = applyAdvancedSearch(state.items, state.advancedSearch)
      } else {
        state.filteredItems = applyFiltersAndSort(state.items, state.filters, state.sortBy, state.searchQuery)
      }
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload
      if (state.advancedSearch) {
        state.advancedSearch.sortBy = action.payload
        state.filteredItems = applyAdvancedSearch(state.items, state.advancedSearch)
      } else {
        state.filteredItems = applyFiltersAndSort(state.items, state.filters, action.payload, state.searchQuery)
      }
    },
    clearFilters: (state) => {
      state.filters = {
        contentType: "all",
        categories: [],
        dateRange: "all",
      }
      state.advancedSearch = null
      state.filteredItems = applyFiltersAndSort(state.items, state.filters, state.sortBy, state.searchQuery)
    },
    reorderContent: (state, action: PayloadAction<{ oldIndex: number; newIndex: number }>) => {
      const { oldIndex, newIndex } = action.payload
      const [removed] = state.filteredItems.splice(oldIndex, 1)
      state.filteredItems.splice(newIndex, 0, removed)
    },
    clearContent: (state) => {
      state.items = []
      state.filteredItems = []
      state.currentPage = 1
      state.hasMore = true
    },
    loadMoreContent: (state) => {
      state.currentPage += 1
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.loading = false
        const { items, page, hasMore } = action.payload
        if (page === 1) {
          state.items = items
        } else {
          state.items = [...state.items, ...items]
        }
        state.hasMore = hasMore
        if (state.advancedSearch) {
          state.filteredItems = applyAdvancedSearch(state.items, state.advancedSearch)
        } else {
          state.filteredItems = applyFiltersAndSort(state.items, state.filters, state.sortBy, state.searchQuery)
        }
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch news"
      })

    builder.addCase(fetchRecommendations.fulfilled, (state, action) => {
      const { items, page } = action.payload
      if (page === 1) {
        const existingNews = state.items.filter((item) => item.type !== "recommendation")
        state.items = [...existingNews, ...items]
      } else {
        state.items = [...state.items, ...items]
      }
      if (state.advancedSearch) {
        state.filteredItems = applyAdvancedSearch(state.items, state.advancedSearch)
      } else {
        state.filteredItems = applyFiltersAndSort(state.items, state.filters, state.sortBy, state.searchQuery)
      }
    })

    builder.addCase(fetchSocialPosts.fulfilled, (state, action) => {
      const { items, page } = action.payload
      if (page === 1) {
        const existingContent = state.items.filter((item) => item.type !== "social")
        state.items = [...existingContent, ...items]
        state.trendingItems = items.slice(0, 10)
      } else {
        state.items = [...state.items, ...items]
      }
      if (state.advancedSearch) {
        state.filteredItems = applyAdvancedSearch(state.items, state.advancedSearch)
      } else {
        state.filteredItems = applyFiltersAndSort(state.items, state.filters, state.sortBy, state.searchQuery)
      }
    })

    builder
      .addCase(searchContent.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(searchContent.fulfilled, (state, action) => {
        state.loading = false
        const { items, page, hasMore } = action.payload
        if (page === 1) {
          state.items = items
        } else {
          state.items = [...state.items, ...items]
        }
        state.hasMore = hasMore
        state.filteredItems = applyFiltersAndSort(state.items, state.filters, state.sortBy, state.searchQuery)
      })
      .addCase(searchContent.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to search content"
      })
  },
})

export const {
  setSearchQuery,
  setAdvancedSearch,
  addSearchHistory,
  clearSearchHistory,
  setContentFilter,
  setSortBy,
  clearFilters,
  reorderContent,
  clearContent,
  loadMoreContent,
} = contentSlice.actions

export default contentSlice.reducer
