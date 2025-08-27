import { configureStore } from "@reduxjs/toolkit"
import contentReducer, {
  setSearchQuery,
  setContentFilter,
  setSortBy,
  clearFilters,
  reorderContent,
  type ContentState,
} from "@/lib/slices/contentSlice"

const initialState: ContentState = {
  items: [
    {
      id: "1",
      type: "news",
      title: "Test News 1",
      description: "Description 1",
      category: "technology",
      publishedAt: "2024-01-01T00:00:00Z",
      source: "Source 1",
    },
    {
      id: "2",
      type: "social",
      title: "Test Social 1",
      description: "Description 2",
      category: "sports",
      publishedAt: "2024-01-02T00:00:00Z",
      source: "Source 2",
    },
  ],
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
  trendingSearches: [],
  advancedSearch: null,
}

describe("contentSlice", () => {
  let store: ReturnType<typeof configureStore>

  beforeEach(() => {
    store = configureStore({
      reducer: { content: contentReducer },
      preloadedState: { content: initialState },
    })
  })

  it("should handle setSearchQuery", () => {
    store.dispatch(setSearchQuery("test"))
    const state = store.getState().content

    expect(state.searchQuery).toBe("test")
    expect(state.filteredItems.length).toBeGreaterThan(0)
  })

  it("should handle setContentFilter", () => {
    store.dispatch(setContentFilter({ type: "contentType", value: "news" }))
    const state = store.getState().content

    expect(state.filters.contentType).toBe("news")
  })

  it("should handle setSortBy", () => {
    store.dispatch(setSortBy("oldest"))
    const state = store.getState().content

    expect(state.sortBy).toBe("oldest")
  })

  it("should handle clearFilters", () => {
    // First set some filters
    store.dispatch(setContentFilter({ type: "contentType", value: "news" }))
    store.dispatch(clearFilters())

    const state = store.getState().content
    expect(state.filters.contentType).toBe("all")
    expect(state.filters.categories).toEqual([])
    expect(state.filters.dateRange).toBe("all")
  })

  it("should handle reorderContent", () => {
    // First populate filteredItems
    store.dispatch(setSearchQuery(""))
    store.dispatch(reorderContent({ oldIndex: 0, newIndex: 1 }))

    const state = store.getState().content
    expect(state.filteredItems[0].id).toBe("2")
    expect(state.filteredItems[1].id).toBe("1")
  })
})
