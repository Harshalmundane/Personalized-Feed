import { test, expect } from "@playwright/test"

test.describe("User Preferences", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("networkidle")
  })

  test("should toggle dark mode", async ({ page }) => {
    // Check initial theme
    const body = page.locator("body")
    const initialClass = await body.getAttribute("class")

    // Toggle dark mode
    await page.getByRole("button", { name: /toggle theme/i }).click()

    // Verify theme changed
    const newClass = await body.getAttribute("class")
    expect(newClass).not.toBe(initialClass)

    // Verify persistence after reload
    await page.reload()
    await page.waitForLoadState("networkidle")

    const persistedClass = await body.getAttribute("class")
    expect(persistedClass).toBe(newClass)
  })

  test("should save and persist user preferences", async ({ page }) => {
    // Open settings
    await page.getByRole("button", { name: /settings/i }).click()

    // Change preferences
    await page.getByLabel("Technology").check()
    await page.getByLabel("Sports").check()
    await page.getByLabel("Grid View").check()

    // Save preferences
    await page.getByRole("button", { name: /save preferences/i }).click()

    // Verify success message
    await expect(page.getByText("Preferences saved")).toBeVisible()

    // Reload and verify persistence
    await page.reload()
    await page.waitForLoadState("networkidle")

    await page.getByRole("button", { name: /settings/i }).click()
    await expect(page.getByLabel("Technology")).toBeChecked()
    await expect(page.getByLabel("Sports")).toBeChecked()
  })

  test("should handle content filtering based on preferences", async ({ page }) => {
    // Set category preferences
    await page.getByRole("button", { name: /settings/i }).click()
    await page.getByLabel("Technology").check()
    await page.getByRole("button", { name: /save preferences/i }).click()

    // Close settings
    await page.getByRole("button", { name: /close/i }).click()

    // Verify content is filtered
    const technologyContent = page.locator("text=technology")
    expect(await technologyContent.count()).toBeGreaterThan(0)
  })
})
