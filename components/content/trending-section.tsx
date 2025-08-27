"use client"

import { useAppSelector } from "@/lib/hooks"
import { ContentCard } from "./content-card"
import { TrendingUp, File as Fire } from "lucide-react"

export function TrendingSection() {
  const { trendingItems } = useAppSelector((state) => state.content)
  const { feedLayout } = useAppSelector((state) => state.userPreferences)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg">
          <Fire className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Trending Now</h2>
          <p className="text-muted-foreground">Discover what's popular across all categories</p>
        </div>
      </div>

      {/* Trending Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg p-4 border">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium">Most Viewed</span>
          </div>
          <p className="text-2xl font-bold mt-2">{trendingItems.length}</p>
          <p className="text-xs text-muted-foreground">trending items</p>
        </div>
        <div className="bg-card rounded-lg p-4 border">
          <div className="flex items-center space-x-2">
            <Fire className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium">Hot Topics</span>
          </div>
          <p className="text-2xl font-bold mt-2">5</p>
          <p className="text-xs text-muted-foreground">categories trending</p>
        </div>
        <div className="bg-card rounded-lg p-4 border">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">Engagement</span>
          </div>
          <p className="text-2xl font-bold mt-2">92%</p>
          <p className="text-xs text-muted-foreground">user interaction</p>
        </div>
      </div>

      {/* Trending Content */}
      {trendingItems.length === 0 ? (
        <div className="text-center py-12">
          <Fire className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No trending content available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingItems.map((item) => (
            <ContentCard key={item.id} item={item} layout="grid" />
          ))}
        </div>
      )}
    </div>
  )
}
