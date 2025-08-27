import type React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import { ContentCard } from "@/components/content/content-card"
import contentReducer from "@/lib/slices/contentSlice"
import userPreferencesReducer from "@/lib/slices/userPreferencesSlice"
import uiReducer from "@/lib/slices/uiSlice"

const mockStore = configureStore({
  reducer: {
    content: contentReducer,
    userPreferences: userPreferencesReducer,
    ui: uiReducer,
  },
})

const mockContentItem = {
  id: "test-1",
  type: "news" as const,
  title: "Test News Article",
  description: "This is a test news article description",
  imageUrl: "/test-image.jpg",
  url: "https://example.com/test",
  category: "technology",
  publishedAt: "2024-01-01T00:00:00Z",
  source: "Test Source",
  isFavorite: false,
}

const renderWithProvider = (component: React.ReactElement) => {
  return render(<Provider store={mockStore}>{component}</Provider>)
}

describe("ContentCard", () => {
  it("renders content card with correct information", () => {
    renderWithProvider(<ContentCard item={mockContentItem} />)

    expect(screen.getByText("Test News Article")).toBeInTheDocument()
    expect(screen.getByText("This is a test news article description")).toBeInTheDocument()
    expect(screen.getByText("Test Source")).toBeInTheDocument()
    expect(screen.getByText("technology")).toBeInTheDocument()
  })

  it("handles favorite toggle correctly", () => {
    renderWithProvider(<ContentCard item={mockContentItem} />)

    const favoriteButton = screen.getByRole("button", { name: /add to favorites/i })
    fireEvent.click(favoriteButton)

    // Test that the favorite state changes
    expect(favoriteButton).toHaveAttribute("aria-pressed", "true")
  })

  it("displays correct content type badge", () => {
    renderWithProvider(<ContentCard item={mockContentItem} />)

    expect(screen.getByText("News")).toBeInTheDocument()
  })

  it("handles external link clicks", () => {
    renderWithProvider(<ContentCard item={mockContentItem} />)

    const linkElement = screen.getByRole("link")
    expect(linkElement).toHaveAttribute("href", "https://example.com/test")
    expect(linkElement).toHaveAttribute("target", "_blank")
  })
})
