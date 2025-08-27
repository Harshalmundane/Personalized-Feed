"use client"

import React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { setSearchQuery } from "@/lib/slices/contentSlice"
import { toggleDarkMode, setFeedLayout } from "@/lib/slices/userPreferencesSlice"
import { SearchSuggestions, AdvancedSearch } from "@/components/search"
import { Sun, Moon, Grid, List, Bell, User } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"

export function Header() {
  const dispatch = useAppDispatch()
  const { searchQuery } = useAppSelector((state) => state.content)
  const { isSearchFocused, activeSection } = useAppSelector((state) => state.ui)
  const { darkMode, feedLayout } = useAppSelector((state) => state.userPreferences)

  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)

  // Debounced search to optimize performance
  const debouncedSearchQuery = useDebounce(localSearchQuery, 300)

  // Update Redux store when debounced value changes
  React.useEffect(() => {
    dispatch(setSearchQuery(debouncedSearchQuery))
  }, [debouncedSearchQuery, dispatch])

  const handleSearchChange = useCallback((value: string) => {
    setLocalSearchQuery(value)
  }, [])

  const handleSearchSelect = useCallback(
    (value: string) => {
      setLocalSearchQuery(value)
      dispatch(setSearchQuery(value))
    },
    [dispatch],
  )

  const getSectionTitle = () => {
    switch (activeSection) {
      case "feed":
        return "Personalized Feed"
      case "trending":
        return "Trending Content"
      case "favorites":
        return "Your Favorites"
      case "settings":
        return "Settings"
      default:
        return "Dashboard"
    }
  }

  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section - Title and Search */}
        <div className="flex items-center space-x-6 flex-1">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{getSectionTitle()}</h1>
            <p className="text-sm text-muted-foreground">
              {activeSection === "feed" && "Stay updated with personalized content"}
              {activeSection === "trending" && "Discover what's popular right now"}
              {activeSection === "favorites" && "Your saved and favorite content"}
              {activeSection === "settings" && "Customize your dashboard experience"}
            </p>
          </div>

          {/* Enhanced Search Bar */}
          {(activeSection === "feed" || activeSection === "trending") && (
            <div className="flex items-center space-x-2 max-w-md flex-1">
              <SearchSuggestions
                value={localSearchQuery}
                onChange={handleSearchChange}
                onSelect={handleSearchSelect}
                className="flex-1"
              />
              <AdvancedSearch />
            </div>
          )}
        </div>

        {/* Right Section - Controls */}
        <div className="flex items-center space-x-2">
          {/* Layout Toggle */}
          {activeSection === "feed" && (
            <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
              <Button
                variant={feedLayout === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => dispatch(setFeedLayout("grid"))}
                className="h-8 w-8 p-0"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={feedLayout === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => dispatch(setFeedLayout("list"))}
                className="h-8 w-8 p-0"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Dark Mode Toggle */}
          <Button variant="ghost" size="sm" onClick={() => dispatch(toggleDarkMode())} className="h-8 w-8 p-0">
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 relative">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full"></span>
          </Button>

          {/* User Menu */}
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <User className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
