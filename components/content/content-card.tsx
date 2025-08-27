"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { toggleFavorite } from "@/lib/slices/userPreferencesSlice"
import { SearchResultsHighlight } from "@/components/search/search-results-highlight"
import { Heart, ExternalLink, Clock, Share2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import type { ContentItem } from "@/lib/slices/contentSlice"

interface ContentCardProps {
  item: ContentItem
  layout: "grid" | "list"
}

export function ContentCard({ item, layout }: ContentCardProps) {
  const dispatch = useAppDispatch()
  const { favoriteContent } = useAppSelector((state) => state.userPreferences)
  const { searchQuery, advancedSearch } = useAppSelector((state) => state.content)
  const isFavorite = favoriteContent.includes(item.id)

  // Determine the search query for highlighting
  const highlightQuery = advancedSearch?.query || searchQuery

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(item.id))
  }

  const getTypeColor = (type: ContentItem["type"]) => {
    switch (type) {
      case "news":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "recommendation":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "social":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  if (layout === "list") {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <div className="flex">
          {item.imageUrl && (
            <div className="w-32 h-24 flex-shrink-0">
              <img
                src={item.imageUrl || "/placeholder.svg"}
                alt={item.title}
                className="w-full h-full object-cover rounded-l-lg"
              />
            </div>
          )}
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge className={getTypeColor(item.type)}>{item.type}</Badge>
                  <Badge variant="outline">{item.category}</Badge>
                </div>
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                  <SearchResultsHighlight text={item.title} searchQuery={highlightQuery} />
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                  <SearchResultsHighlight text={item.description} searchQuery={highlightQuery} />
                </p>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true })}
                  </span>
                  <span>{item.source}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleToggleFavorite}
                  className={cn("h-8 w-8 p-0", isFavorite && "text-red-500")}
                >
                  <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Share2 className="w-4 h-4" />
                </Button>
                {item.url && (
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <CardHeader className="p-0">
        {item.imageUrl && (
          <div className="aspect-video w-full overflow-hidden rounded-t-lg">
            <img
              src={item.imageUrl || "/placeholder.svg"}
              alt={item.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
            />
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Badge className={getTypeColor(item.type)}>{item.type}</Badge>
          <Badge variant="outline">{item.category}</Badge>
        </div>
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          <SearchResultsHighlight text={item.title} searchQuery={highlightQuery} />
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
          <SearchResultsHighlight text={item.description} searchQuery={highlightQuery} />
        </p>
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <span className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true })}
          </span>
          <span>{item.source}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleFavorite}
            className={cn("h-8 w-8 p-0", isFavorite && "text-red-500")}
          >
            <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
        {item.url && (
          <Button variant="outline" size="sm" asChild>
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              Read More
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
