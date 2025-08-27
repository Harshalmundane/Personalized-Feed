"use client"

import { useAppSelector } from "@/lib/hooks"
import { ContentCard } from "./content-card"
import { Heart, BookmarkX } from "lucide-react"

export function FavoritesSection() {
  const { items } = useAppSelector((state) => state.content)
  const { favoriteContent, feedLayout } = useAppSelector((state) => state.userPreferences)

  const favoriteItems = items.filter((item) => favoriteContent.includes(item.id))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg">
          <Heart className="w-5 h-5 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Your Favorites</h2>
          <p className="text-muted-foreground">Content you've saved for later</p>
        </div>
      </div>

      {/* Favorites Stats */}
      <div className="bg-card rounded-lg p-4 border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Favorites</p>
            <p className="text-2xl font-bold">{favoriteItems.length}</p>
          </div>
          <Heart className="w-8 h-8 text-red-500" />
        </div>
      </div>

      {/* Favorites Content */}
      {favoriteItems.length === 0 ? (
        <div className="text-center py-12">
          <BookmarkX className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
          <p className="text-muted-foreground">
            Start adding content to your favorites by clicking the heart icon on any content card.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteItems.map((item) => (
            <ContentCard key={item.id} item={item} layout="grid" />
          ))}
        </div>
      )}
    </div>
  )
}
