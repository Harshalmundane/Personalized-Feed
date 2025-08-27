"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { updateCategories, toggleDarkMode, setLanguage, setFeedLayout } from "@/lib/slices/userPreferencesSlice"
import { Settings, Palette, Globe, Layout, X } from "lucide-react"
import { useState } from "react"

const availableCategories = [
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

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
]

export function SettingsPanel() {
  const dispatch = useAppDispatch()
  const { categories, darkMode, language, feedLayout } = useAppSelector((state) => state.userPreferences)
  const [selectedCategories, setSelectedCategories] = useState(categories)

  const handleCategoryToggle = (category: string) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category]
    setSelectedCategories(updated)
    dispatch(updateCategories(updated))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Settings</h2>
          <p className="text-muted-foreground">Customize your dashboard experience</p>
        </div>
      </div>

      {/* Content Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Layout className="w-5 h-5" />
            <span>Content Preferences</span>
          </CardTitle>
          <CardDescription>Choose the categories you're interested in</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-3">Selected Categories ({selectedCategories.length})</p>
            <div className="flex flex-wrap gap-2">
              {availableCategories.map((category) => {
                const isSelected = selectedCategories.includes(category)
                return (
                  <Badge
                    key={category}
                    variant={isSelected ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/80 capitalize"
                    onClick={() => handleCategoryToggle(category)}
                  >
                    {category}
                    {isSelected && <X className="w-3 h-3 ml-1" />}
                  </Badge>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="w-5 h-5" />
            <span>Appearance</span>
          </CardTitle>
          <CardDescription>Customize how your dashboard looks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-muted-foreground">Toggle between light and dark themes</p>
            </div>
            <Switch checked={darkMode} onCheckedChange={() => dispatch(toggleDarkMode())} />
          </div>

          <div className="space-y-3">
            <div>
              <p className="font-medium">Feed Layout</p>
              <p className="text-sm text-muted-foreground">Choose how content is displayed</p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant={feedLayout === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => dispatch(setFeedLayout("grid"))}
              >
                Grid View
              </Button>
              <Button
                variant={feedLayout === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => dispatch(setFeedLayout("list"))}
              >
                List View
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-5 h-5" />
            <span>Language & Region</span>
          </CardTitle>
          <CardDescription>Set your preferred language</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="font-medium">Language</p>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <Button
                  key={lang.code}
                  variant={language === lang.code ? "default" : "outline"}
                  size="sm"
                  onClick={() => dispatch(setLanguage(lang.code))}
                >
                  {lang.name}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
