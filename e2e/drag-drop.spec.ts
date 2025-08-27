import { test, expect } from "@playwright/test"

test.describe("Drag and Drop Functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("networkidle")

    // Enable drag and drop mode
    await page.getByRole("button", { name: /enable drag/i }).click()
  })

  test("should reorder content cards via drag and drop", async ({ page }) => {
    const contentCards = page.locator('[data-testid="content-card"]')
    await expect(contentCards.first()).toBeVisible()

    // Get initial order
    const firstCardTitle = await contentCards.first().locator("h3").textContent()
    const secondCardTitle = await contentCards.nth(1).locator("h3").textContent()

    // Perform drag and drop
    await contentCards.first().dragTo(contentCards.nth(1))

    // Wait for animation to complete
    await page.waitForTimeout(500)

    // Verify order has changed
    const newFirstCardTitle = await contentCards.first().locator("h3").textContent()
    const newSecondCardTitle = await contentCards.nth(1).locator("h3").textContent()

    expect(newFirstCardTitle).toBe(secondCardTitle)
    expect(newSecondCardTitle).toBe(firstCardTitle)
  })

  test("should show drag tutorial for new users", async ({ page }) => {
    // Check if tutorial appears
    await expect(page.getByText("Drag and Drop Tutorial")).toBeVisible()

    // Close tutorial
    await page.getByRole("button", { name: /got it/i }).click()

    // Verify tutorial is hidden
    await expect(page.getByText("Drag and Drop Tutorial")).not.toBeVisible()
  })

  test("should handle keyboard accessibility for drag and drop", async ({ page }) => {
    const firstCard = page.locator('[data-testid="content-card"]').first()

    // Focus on first card
    await firstCard.focus()

    // Use keyboard to activate drag mode
    await page.keyboard.press("Space")

    // Move down one position
    await page.keyboard.press("ArrowDown")

    // Confirm drop
    await page.keyboard.press("Space")

    // Verify position changed
    await expect(page.getByText("Item moved")).toBeVisible()
  })
})
