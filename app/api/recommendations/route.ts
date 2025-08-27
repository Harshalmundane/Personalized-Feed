import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const categories = searchParams.get("categories")?.split(",") || ["technology"]
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "8")

  try {
    // Mock personalized recommendations - replace with ML-based recommendations
    const mockRecommendations = categories.flatMap((category) =>
      Array.from({ length: limit }, (_, i) => ({
        id: `rec-${category}-${page}-${i}`,
        type: "recommendation" as const,
        title: `Recommended: ${category} insights ${page * limit + i + 1}`,
        description: `Personalized ${category} content curated just for you based on your reading history and preferences. Discover new perspectives and trending topics.`,
        imageUrl: `/placeholder.svg?height=200&width=300&query=${category} personalized content`,
        url: `https://example.com/recommendations/${category}/${page * limit + i}`,
        category,
        publishedAt: new Date(Date.now() - (page * limit + i) * 7200000).toISOString(),
        source: "RecommendationEngine",
        isFavorite: false,
      })),
    )

    return NextResponse.json({
      items: mockRecommendations,
      page,
      hasMore: page < 4,
      total: categories.length * 32,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 })
  }
}
