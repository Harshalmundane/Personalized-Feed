// Configuration for external API integrations
export const API_CONFIGS = {
  NEWS_API: {
    baseUrl: "https://newsapi.org/v2",
    apiKey: process.env.NEWS_API_KEY,
    endpoints: {
      topHeadlines: "/top-headlines",
      everything: "/everything",
    },
  },
  REDDIT_API: {
    baseUrl: "https://www.reddit.com/r",
    endpoints: {
      hot: "/hot.json",
      top: "/top.json",
    },
  },
  TWITTER_API: {
    baseUrl: "https://api.twitter.com/2",
    bearerToken: process.env.TWITTER_BEARER_TOKEN,
    endpoints: {
      search: "/tweets/search/recent",
      trends: "/trends/place",
    },
  },
}

// Example integration functions (commented out - uncomment when ready to use real APIs)
/*
export async function fetchRealNews(categories: string[], page = 1) {
  const response = await fetch(
    `${API_CONFIGS.NEWS_API.baseUrl}${API_CONFIGS.NEWS_API.endpoints.topHeadlines}?` +
    `category=${categories[0]}&page=${page}&apiKey=${API_CONFIGS.NEWS_API.apiKey}`
  )
  
  if (!response.ok) {
    throw new Error('Failed to fetch news from NewsAPI')
  }
  
  const data = await response.json()
  return {
    items: data.articles.map(article => ({
      id: article.url,
      type: 'news' as const,
      title: article.title,
      description: article.description,
      imageUrl: article.urlToImage,
      url: article.url,
      category: categories[0],
      publishedAt: article.publishedAt,
      source: article.source.name,
    })),
    page,
    hasMore: data.articles.length === 20,
  }
}
*/
