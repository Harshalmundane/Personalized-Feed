import { test, expect } from "@playwright/test"

test.describe("Content Feed", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("networkidle")
  })

  test("should load initial content", async ({ page }) => {
    // Wait for content to load
    const contentCards = page.locator('[data-testid="content-card"]')
    await expect(contentCards.first()).toBeVisible()

    // Verify multiple content types are present
    await expect(page.locator("text=News")).toBeVisible()
    await expect(page.locator("text=Social")).toBeVisible()
  })

  test("should implement infinite scrolling", async ({ page }) => {
    // Get initial content count
    const initialCards = page.locator('[data-testid="content-card"]')
    const initialCount = await initialCards.count()

    // Scroll to bottom
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight)
    })

    // Wait for new content to load
    await page.waitForTimeout(2000)

    // Verify more content loaded
    const newCount = await initialCards.count()
    expect(newCount).toBeGreaterThan(initialCount)
  })

  test("should handle content filtering", async ({ page }) => {
    // Apply content type filter
    await page.getByRole("button", { name: /filters/i }).click()
    await page.getByLabel("Content Type").selectOption("news")
    await page.getByRole("button", { name: /apply filters/i }).click()

    // Verify only news content is shown
    const newsLabels = page.locator("text=News")
    const socialLabels = page.locator("text=Social")

    expect(await newsLabels.count()).toBeGreaterThan(0)
    expect(await socialLabels.count()).toBe(0)
  })

  test("should handle favorite functionality", async ({ page }) => {
    const firstCard = page.locator('[data-testid="content-card"]').first()
    const favoriteButton = firstCard.getByRole("button", { name: /add to favorites/i })

    // Add to favorites
    await favoriteButton.click()

    // Verify favorite state
    await expect(favoriteButton).toHaveAttribute("aria-pressed", "true")

    // Navigate to favorites section
    await page.getByRole("button", { name: /favorites/i }).click()

    // Verify item appears in favorites
    await expect(page.locator('[data-testid="content-card"]')).toBeVisible()
  })
})
