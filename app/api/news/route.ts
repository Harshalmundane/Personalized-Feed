import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const categories = searchParams.get("categories")?.split(",") || ["general"]
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")

  try {
    // Mock API response - replace with real API integration
    const mockNews = categories.flatMap((category) =>
      Array.from({ length: limit }, (_, i) => ({
        id: `news-${category}-${page}-${i}`,
        type: "news" as const,
        title: `Breaking: ${category} news update ${page * limit + i + 1}`,
        description: `Latest developments in ${category}. This comprehensive report covers all the important details you need to know about recent events and their implications.`,
        imageUrl: `/placeholder.svg?height=200&width=300&query=${category} breaking news`,
        url: `https://example.com/news/${category}/${page * limit + i}`,
        category,
        publishedAt: new Date(Date.now() - (page * limit + i) * 3600000).toISOString(),
        source: "NewsAPI",
        isFavorite: false,
      })),
    )

    return NextResponse.json({
      items: mockNews,
      page,
      hasMore: page < 5,
      total: categories.length * 50,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 })
  }
}
