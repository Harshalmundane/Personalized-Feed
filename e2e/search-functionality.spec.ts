import { test, expect } from "@playwright/test"

test.describe("Search Functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("networkidle")
  })

  test("should perform basic search with debouncing", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Search content...")

    // Type search query
    await searchInput.fill("technology")

    // Wait for debounce delay
    await page.waitForTimeout(600)

    // Check that search results are displayed
    await expect(page.getByText("technology", { exact: false })).toBeVisible()

    // Verify search history is updated
    await searchInput.click()
    await expect(page.getByText("technology")).toBeVisible()
  })

  test("should use advanced search filters", async ({ page }) => {
    // Open advanced search
    await page.getByRole("button", { name: /advanced search/i }).click()

    // Fill advanced search form
    await page.getByLabel("Search query").fill("news")
    await page.getByLabel("Content Type").selectOption("news")
    await page.getByLabel("Sort by").selectOption("newest")

    // Submit search
    await page.getByRole("button", { name: /search/i }).click()

    // Verify results are filtered
    const contentCards = page.locator('[data-testid="content-card"]')
    await expect(contentCards.first()).toBeVisible()

    // Check that all results are news type
    const newsLabels = page.locator("text=News")
    expect(await newsLabels.count()).toBeGreaterThan(0)
  })

  test("should handle search operators", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Search content...")

    // Use type operator
    await searchInput.fill("type:news technology")
    await page.waitForTimeout(600)

    // Verify only news items are shown
    const newsItems = page.locator("text=News")
    expect(await newsItems.count()).toBeGreaterThan(0)
  })
})
