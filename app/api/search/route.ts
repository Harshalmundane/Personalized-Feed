import { type NextRequest, NextResponse } from "next/server"

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q") || ""
  const type = searchParams.get("type") || "all"
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "20")

  try {
    // Mock search results - replace with actual search implementation
    const searchResults = Array.from({ length: limit }, (_, i) => ({
      id: `search-${query}-${page}-${i}`,
      type: type === "all" ? (["news", "recommendation", "social"][i % 3] as const) : (type as const),
      title: `${query} search result ${page * limit + i + 1}`,
      description: `Search result for "${query}". This content matches your search criteria and provides relevant information about the topic you're looking for.`,
      imageUrl: `/placeholder.svg?height=200&width=300&query=${query} search result`,
      category: query.split(" ")[0] || "general",
      publishedAt: new Date(Date.now() - (page * limit + i) * 3600000).toISOString(),
      source: "SearchAPI",
      isFavorite: false,
    }))

    return NextResponse.json(
      {
        items: searchResults,
        page,
        hasMore: page < 3,
        total: 60,
        query,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      },
    )
  } catch (error) {
    // Added CORS headers to the error response
    return NextResponse.json(
      { error: "Failed to perform search" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      },
    )
  }
}
