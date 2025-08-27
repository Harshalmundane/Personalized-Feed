"use client"

import { Button } from "@/components/ui/button"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { setActiveSection, toggleSidebar } from "@/lib/slices/uiSlice"
import { Home, TrendingUp, Heart, Settings, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const navigationItems = [
  {
    id: "feed" as const,
    label: "Feed",
    icon: Home,
    description: "Your personalized content",
  },
  {
    id: "trending" as const,
    label: "Trending",
    icon: TrendingUp,
    description: "What's popular now",
  },
  {
    id: "favorites" as const,
    label: "Favorites",
    icon: Heart,
    description: "Your saved content",
  },
  {
    id: "settings" as const,
    label: "Settings",
    icon: Settings,
    description: "Customize your experience",
  },
]

export function Sidebar() {
  const { sidebarOpen, activeSection } = useAppSelector((state) => state.ui)
  const dispatch = useAppDispatch()

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => dispatch(toggleSidebar())} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full bg-sidebar border-r border-sidebar-border transition-all duration-300",
          sidebarOpen ? "w-64" : "w-16",
          "lg:relative lg:z-auto",
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          {sidebarOpen && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
                <Home className="w-4 h-4 text-sidebar-primary-foreground" />
              </div>
              <span className="font-semibold text-sidebar-foreground">Dashboard</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(toggleSidebar())}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-2 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id

            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start text-left",
                  sidebarOpen ? "px-3" : "px-2",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
                onClick={() => dispatch(setActiveSection(item.id))}
              >
                <Icon className={cn("w-4 h-4", sidebarOpen ? "mr-3" : "mx-auto")} />
                {sidebarOpen && (
                  <div className="flex flex-col">
                    <span className="font-medium">{item.label}</span>
                    <span className="text-xs opacity-70">{item.description}</span>
                  </div>
                )}
              </Button>
            )
          })}
        </nav>

        {/* User Profile Section */}
        {sidebarOpen && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-sidebar-accent rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-sidebar-accent-foreground">U</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">User</p>
                <p className="text-xs text-sidebar-foreground/70 truncate">user@example.com</p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
