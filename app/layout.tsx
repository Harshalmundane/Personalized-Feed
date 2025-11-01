import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { ReduxProvider } from "@/components/providers/redux-provider"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "Personalized Feed Dashboard",
  description: "Your personalized content hub for news, recommendations, and social media",
  generator: "Harshal Mundane",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ReduxProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
