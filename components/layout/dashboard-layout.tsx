"use client"

import type React from "react"
import { useEffect } from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { sidebarOpen } = useAppSelector((state) => state.ui)
  const { darkMode } = useAppSelector((state) => state.userPreferences)
  const dispatch = useAppDispatch()

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  return (
    <div className="min-h-screen bg-background">
  <div className="flex h-screen">
  {/* Sidebar */}
  <Sidebar />

  {/* Main Content */}
  <div className="flex-1 flex flex-col transition-all duration-300">
    {/* Header */}
    <Header />

    {/* Content Area */}
    <main className="flex-1 overflow-auto p-6 bg-background">
      <div className="max-w-7xl mx-auto">{children}</div>
    </main>
  </div>
</div>

    </div>
  )
}
