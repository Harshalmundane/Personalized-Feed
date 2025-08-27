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
  const hashtags = searchParams.get("hashtags")?.split(",") || ["trending"]
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "12")

  try {
    // Mock social media posts - replace with real social media API integration
    const mockPosts = hashtags.flatMap((hashtag) =>
      Array.from({ length: limit }, (_, i) => ({
        id: `social-${hashtag}-${page}-${i}`,
        type: "social" as const,
        title: `#${hashtag} viral post ${page * limit + i + 1}`,
        description: `Trending content about #${hashtag} that's gaining massive engagement across social platforms. Join the conversation and see what everyone's talking about.`,
        imageUrl: `/placeholder.svg?height=200&width=300&query=${hashtag} viral social media`,
        category: hashtag,
        publishedAt: new Date(Date.now() - (page * limit + i) * 1800000).toISOString(),
        source: "SocialMediaAPI",
        isFavorite: false,
      })),
    )

    return NextResponse.json(
      {
        items: mockPosts,
        page,
        hasMore: page < 6,
        total: hashtags.length * 72,
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
    return NextResponse.json(
      { error: "Failed to fetch social posts" },
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
