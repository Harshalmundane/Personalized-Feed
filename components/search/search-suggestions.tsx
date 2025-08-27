"use client"

import { useState, useEffect } from "react"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { addSearchHistory, clearSearchHistory } from "@/lib/slices/contentSlice"
import { Search, Clock, TrendingUp, Hash } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchSuggestionsProps {
  value: string
  onChange: (value: string) => void
  onSelect: (value: string) => void
  className?: string
}

export function SearchSuggestions({ value, onChange, onSelect, className }: SearchSuggestionsProps) {
  const dispatch = useAppDispatch()
  const { items, searchHistory, trendingSearches } = useAppSelector((state) => state.content)
  const [open, setOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])

  // Generate suggestions based on content
  useEffect(() => {
    if (value.length > 0) {
      const query = value.toLowerCase()
      const titleSuggestions = items
        .filter((item) => item.title.toLowerCase().includes(query))
        .map((item) => item.title)
        .slice(0, 3)

      const categorySuggestions = items
        .filter((item) => item.category.toLowerCase().includes(query))
        .map((item) => item.category)
        .slice(0, 3)

      const uniqueSuggestions = Array.from(new Set([...titleSuggestions, ...categorySuggestions]))
      setSuggestions(uniqueSuggestions.slice(0, 5))
    } else {
      setSuggestions([])
    }
  }, [value, items])

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue)
    onSelect(selectedValue)
    dispatch(addSearchHistory(selectedValue))
    setOpen(false)
  }

  const handleClearHistory = () => {
    dispatch(clearSearchHistory())
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className={cn("relative", className)}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search content, categories, or topics..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setOpen(true)}
            className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandList>
            <CommandEmpty>No suggestions found.</CommandEmpty>

            {/* Search History */}
            {searchHistory.length > 0 && (
              <CommandGroup heading="Recent Searches">
                <div className="flex items-center justify-between px-2 py-1">
                  <span className="text-xs text-muted-foreground">Recent</span>
                  <Button variant="ghost" size="sm" onClick={handleClearHistory} className="h-6 text-xs">
                    Clear
                  </Button>
                </div>
                {searchHistory.slice(0, 3).map((search, index) => (
                  <CommandItem key={index} onSelect={() => handleSelect(search)}>
                    <Clock className="w-4 h-4 mr-2" />
                    {search}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Trending Searches */}
            {trendingSearches.length > 0 && (
              <CommandGroup heading="Trending">
                {trendingSearches.slice(0, 3).map((search, index) => (
                  <CommandItem key={index} onSelect={() => handleSelect(search)}>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    {search}
                    <Badge variant="secondary" className="ml-auto text-xs">
                      Trending
                    </Badge>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Live Suggestions */}
            {suggestions.length > 0 && (
              <CommandGroup heading="Suggestions">
                {suggestions.map((suggestion, index) => (
                  <CommandItem key={index} onSelect={() => handleSelect(suggestion)}>
                    <Hash className="w-4 h-4 mr-2" />
                    {suggestion}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Quick Filters */}
            <CommandGroup heading="Quick Filters">
              <CommandItem onSelect={() => handleSelect("type:news")}>
                <Search className="w-4 h-4 mr-2" />
                Search in News only
              </CommandItem>
              <CommandItem onSelect={() => handleSelect("type:recommendation")}>
                <Search className="w-4 h-4 mr-2" />
                Search in Recommendations
              </CommandItem>
              <CommandItem onSelect={() => handleSelect("type:social")}>
                <Search className="w-4 h-4 mr-2" />
                Search in Social Posts
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
