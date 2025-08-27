import { GET } from "@/app/api/news/route"
import { NextRequest } from "next/server"

describe("/api/news", () => {
  it("should return news items with default parameters", async () => {
    const request = new NextRequest("http://localhost:3000/api/news")
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty("items")
    expect(data).toHaveProperty("page")
    expect(data).toHaveProperty("hasMore")
    expect(data).toHaveProperty("total")
    expect(Array.isArray(data.items)).toBe(true)
  })

  it("should handle categories parameter", async () => {
    const request = new NextRequest("http://localhost:3000/api/news?categories=technology,sports")
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.items.length).toBeGreaterThan(0)
    expect(data.items.some((item: any) => item.category === "technology")).toBe(true)
    expect(data.items.some((item: any) => item.category === "sports")).toBe(true)
  })

  it("should handle pagination parameters", async () => {
    const request = new NextRequest("http://localhost:3000/api/news?page=2&limit=5")
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.page).toBe(2)
    expect(data.items.length).toBeLessThanOrEqual(5)
  })
})
