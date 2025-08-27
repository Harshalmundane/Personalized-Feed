"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { setContentFilter, setSortBy, clearFilters } from "@/lib/slices/contentSlice"
import { Filter, X, TrendingUp, Clock, Star } from "lucide-react"

const contentTypes = [
  { value: "all", label: "All Content", icon: Filter },
  { value: "news", label: "News", icon: Clock },
  { value: "recommendation", label: "Recommendations", icon: Star },
  { value: "social", label: "Social Posts", icon: TrendingUp },
]

const categories = [
  "technology",
  "sports",
  "finance",
  "health",
  "entertainment",
  "science",
  "politics",
  "business",
  "travel",
  "food",
]

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "relevance", label: "Most Relevant" },
  { value: "popular", label: "Most Popular" },
]

export function ContentFilters() {
  const dispatch = useAppDispatch()
  const { filters, sortBy } = useAppSelector((state) => state.content)
  const { categories: userCategories } = useAppSelector((state) => state.userPreferences)

  const handleTypeFilter = (type: string) => {
    dispatch(setContentFilter({ type: "contentType", value: type }))
  }

  const handleCategoryFilter = (category: string) => {
    const isSelected = filters.categories.includes(category)
    const updatedCategories = isSelected
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category]
    dispatch(setContentFilter({ type: "categories", value: updatedCategories }))
  }

  const handleDateFilter = (dateRange: string) => {
    dispatch(setContentFilter({ type: "dateRange", value: dateRange }))
  }

  const handleSortChange = (value: string) => {
    dispatch(setSortBy(value))
  }

  const hasActiveFilters = filters.contentType !== "all" || filters.categories.length > 0 || filters.dateRange !== "all"

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={() => dispatch(clearFilters())}>
              <X className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Content Type Filter */}
        <div>
          <p className="text-sm font-medium mb-2">Content Type</p>
          <div className="flex flex-wrap gap-2">
            {contentTypes.map((type) => {
              const Icon = type.icon
              const isActive = filters.contentType === type.value
              return (
                <Button
                  key={type.value}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTypeFilter(type.value)}
                  className="h-8"
                >
                  <Icon className="w-3 h-3 mr-1" />
                  {type.label}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <p className="text-sm font-medium mb-2">Categories</p>
          <div className="flex flex-wrap gap-2">
            {userCategories.map((category) => {
              const isSelected = filters.categories.includes(category)
              return (
                <Badge
                  key={category}
                  variant={isSelected ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/80 capitalize"
                  onClick={() => handleCategoryFilter(category)}
                >
                  {category}
                  {isSelected && <X className="w-3 h-3 ml-1" />}
                </Badge>
              )
            })}
          </div>
        </div>

        {/* Date Range and Sort */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <p className="text-sm font-medium mb-2">Date Range</p>
            <Select value={filters.dateRange} onValueChange={handleDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium mb-2">Sort By</p>
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-2">Active filters:</p>
            <div className="flex flex-wrap gap-1">
              {filters.contentType !== "all" && (
                <Badge variant="secondary" className="text-xs">
                  Type: {filters.contentType}
                </Badge>
              )}
              {filters.categories.map((category) => (
                <Badge key={category} variant="secondary" className="text-xs capitalize">
                  {category}
                </Badge>
              ))}
              {filters.dateRange !== "all" && (
                <Badge variant="secondary" className="text-xs">
                  {filters.dateRange}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
