"use client"

import { useEffect, useCallback } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import {
  fetchNews,
  fetchRecommendations,
  fetchSocialPosts,
  clearContent,
  loadMoreContent,
} from "@/lib/slices/contentSlice"
import { ContentCard } from "./content-card"
import { ContentFilters } from "./content-filters"
import { ContentSkeleton } from "./content-skeleton"
import { SortableContentFeed } from "./sortable-content-feed"
import { DragDropTutorial } from "./drag-drop-tutorial"
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RefreshCw, Loader2, Move } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

export function ContentFeed() {
  const dispatch = useAppDispatch()
  const { filteredItems, loading, error, hasMore, currentPage } = useAppSelector((state) => state.content)
  const { categories, feedLayout } = useAppSelector((state) => state.userPreferences)
  const [dragEnabled, setDragEnabled] = useState(true)

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      dispatch(loadMoreContent())
      dispatch(fetchNews({ categories, page: currentPage + 1 }))
      dispatch(fetchRecommendations({ categories, page: currentPage + 1 }))
      dispatch(fetchSocialPosts({ hashtags: categories, page: currentPage + 1 }))
    }
  }, [dispatch, categories, currentPage, loading, hasMore])

  const { loadingRef } = useInfiniteScroll({
    hasMore,
    loading,
    onLoadMore: loadMore,
  })

  useEffect(() => {
    // Clear existing content and fetch new data
    dispatch(clearContent())
    dispatch(fetchNews({ categories, page: 1 }))
    dispatch(fetchRecommendations({ categories, page: 1 }))
    dispatch(fetchSocialPosts({ hashtags: categories, page: 1 }))
  }, [dispatch, categories])

  const handleRefresh = () => {
    dispatch(clearContent())
    dispatch(fetchNews({ categories, page: 1 }))
    dispatch(fetchRecommendations({ categories, page: 1 }))
    dispatch(fetchSocialPosts({ hashtags: categories, page: 1 }))
  }

  if (loading && filteredItems.length === 0) {
    return (
      <div className="space-y-6">
        <ContentFilters />
        <ContentSkeleton layout={feedLayout} count={6} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive mb-4">Error loading content: {error}</p>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <ContentFilters />

      <DragDropTutorial />

      {/* Header with Drag Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Your Personalized Feed</h2>
          <p className="text-muted-foreground">
            {filteredItems.length} items • Updated {new Date().toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Move className="w-4 h-4 text-muted-foreground" />
            <Label htmlFor="drag-toggle" className="text-sm">
              Enable Drag & Drop
            </Label>
            <Switch id="drag-toggle" checked={dragEnabled} onCheckedChange={setDragEnabled} />
          </div>
          <Button onClick={handleRefresh} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Content Feed */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No content found. Try adjusting your preferences or search query.</p>
        </div>
      ) : (
        <>
          {dragEnabled ? (
            <SortableContentFeed items={filteredItems} layout={feedLayout} />
          ) : (
            <div
              className={cn(
                "gap-6",
                feedLayout === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "flex flex-col space-y-4",
              )}
            >
              {filteredItems.map((item) => (
                <div key={item.id}>
                  <ContentCard item={item} layout={feedLayout} />
                </div>
              ))}
            </div>
          )}

          <div ref={loadingRef} className="flex justify-center py-8">
            {loading && (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-muted-foreground">Loading more content...</span>
              </div>
            )}
            {!hasMore && filteredItems.length > 0 && (
              <p className="text-muted-foreground">You've reached the end of your feed</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
