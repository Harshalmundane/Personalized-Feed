"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ContentFeed } from "@/components/content/content-feed"
import { TrendingSection } from "@/components/content/trending-section"
import { FavoritesSection } from "@/components/content/favorites-section"
import { SettingsPanel } from "@/components/settings/settings-panel"
import { useAppSelector } from "@/lib/hooks"

export default function Dashboard() {
  const activeSection = useAppSelector((state) => state.ui.activeSection)

  const renderActiveSection = () => {
    switch (activeSection) {
      case "feed":
        return <ContentFeed />
      case "trending":
        return <TrendingSection />
      case "favorites":
        return <FavoritesSection />
      case "settings":
        return <SettingsPanel />
      default:
        return <ContentFeed />
    }
  }

  return <DashboardLayout>{renderActiveSection()}</DashboardLayout>
}
