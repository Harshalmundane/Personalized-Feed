"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { setAdvancedSearch } from "@/lib/slices/contentSlice"
import { Settings, Plus, X } from "lucide-react"

interface AdvancedSearchState {
  query: string
  exactPhrase: string
  excludeWords: string[]
  contentTypes: string[]
  categories: string[]
  sources: string[]
  dateFrom: string
  dateTo: string
  sortBy: string
}

export function AdvancedSearch() {
  const dispatch = useAppDispatch()
  const { items } = useAppSelector((state) => state.content)
  const [open, setOpen] = useState(false)
  const [searchState, setSearchState] = useState<AdvancedSearchState>({
    query: "",
    exactPhrase: "",
    excludeWords: [],
    contentTypes: [],
    categories: [],
    sources: [],
    dateFrom: "",
    dateTo: "",
    sortBy: "relevance",
  })

  const availableContentTypes = ["news", "recommendation", "social"]
  const availableCategories = Array.from(new Set(items.map((item) => item.category)))
  const availableSources = Array.from(new Set(items.map((item) => item.source)))

  const handleAddExcludeWord = (word: string) => {
    if (word.trim() && !searchState.excludeWords.includes(word.trim())) {
      setSearchState((prev) => ({
        ...prev,
        excludeWords: [...prev.excludeWords, word.trim()],
      }))
    }
  }

  const handleRemoveExcludeWord = (word: string) => {
    setSearchState((prev) => ({
      ...prev,
      excludeWords: prev.excludeWords.filter((w) => w !== word),
    }))
  }

  const handleContentTypeToggle = (type: string) => {
    setSearchState((prev) => ({
      ...prev,
      contentTypes: prev.contentTypes.includes(type)
        ? prev.contentTypes.filter((t) => t !== type)
        : [...prev.contentTypes, type],
    }))
  }

  const handleCategoryToggle = (category: string) => {
    setSearchState((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }))
  }

  const handleSourceToggle = (source: string) => {
    setSearchState((prev) => ({
      ...prev,
      sources: prev.sources.includes(source) ? prev.sources.filter((s) => s !== source) : [...prev.sources, source],
    }))
  }

  const handleSearch = () => {
    dispatch(setAdvancedSearch(searchState))
    setOpen(false)
  }

  const handleReset = () => {
    setSearchState({
      query: "",
      exactPhrase: "",
      excludeWords: [],
      contentTypes: [],
      categories: [],
      sources: [],
      dateFrom: "",
      dateTo: "",
      sortBy: "relevance",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Advanced Search
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Advanced Search</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Basic Search */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="query">Search Terms</Label>
              <Input
                id="query"
                placeholder="Enter keywords..."
                value={searchState.query}
                onChange={(e) => setSearchState((prev) => ({ ...prev, query: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="exactPhrase">Exact Phrase</Label>
              <Input
                id="exactPhrase"
                placeholder="Enter exact phrase..."
                value={searchState.exactPhrase}
                onChange={(e) => setSearchState((prev) => ({ ...prev, exactPhrase: e.target.value }))}
              />
            </div>
            <div>
              <Label>Exclude Words</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {searchState.excludeWords.map((word) => (
                  <Badge key={word} variant="secondary" className="cursor-pointer">
                    {word}
                    <X className="w-3 h-3 ml-1" onClick={() => handleRemoveExcludeWord(word)} />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add word to exclude..."
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleAddExcludeWord(e.currentTarget.value)
                      e.currentTarget.value = ""
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement
                    handleAddExcludeWord(input.value)
                    input.value = ""
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Content Filters */}
          <div className="space-y-4">
            <div>
              <Label>Content Types</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {availableContentTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${type}`}
                      checked={searchState.contentTypes.includes(type)}
                      onCheckedChange={() => handleContentTypeToggle(type)}
                    />
                    <Label htmlFor={`type-${type}`} className="capitalize">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Categories</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {availableCategories.slice(0, 8).map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`cat-${category}`}
                      checked={searchState.categories.includes(category)}
                      onCheckedChange={() => handleCategoryToggle(category)}
                    />
                    <Label htmlFor={`cat-${category}`} className="capitalize">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Sources</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {availableSources.map((source) => (
                  <div key={source} className="flex items-center space-x-2">
                    <Checkbox
                      id={`source-${source}`}
                      checked={searchState.sources.includes(source)}
                      onCheckedChange={() => handleSourceToggle(source)}
                    />
                    <Label htmlFor={`source-${source}`}>{source}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dateFrom">From Date</Label>
              <Input
                id="dateFrom"
                type="date"
                value={searchState.dateFrom}
                onChange={(e) => setSearchState((prev) => ({ ...prev, dateFrom: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="dateTo">To Date</Label>
              <Input
                id="dateTo"
                type="date"
                value={searchState.dateTo}
                onChange={(e) => setSearchState((prev) => ({ ...prev, dateTo: e.target.value }))}
              />
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <Label>Sort Results By</Label>
            <Select
              value={searchState.sortBy}
              onValueChange={(value) => setSearchState((prev) => ({ ...prev, sortBy: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSearch}>Search</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
