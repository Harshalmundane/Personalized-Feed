"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAppSelector } from "@/lib/hooks"
import { Move, X, MousePointer, Keyboard, Smartphone } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function DragDropTutorial() {
  const { filteredItems } = useAppSelector((state) => state.content)
  const [showTutorial, setShowTutorial] = useState(false)

  // Show tutorial when user first has content and hasn't seen it before
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem("dragDropTutorialSeen")
    if (!hasSeenTutorial && filteredItems.length > 0) {
      setShowTutorial(true)
    }
  }, [filteredItems.length])

  const handleDismiss = () => {
    setShowTutorial(false)
    localStorage.setItem("dragDropTutorialSeen", "true")
  }

  const handleShowAgain = () => {
    setShowTutorial(true)
  }

  if (!showTutorial) {
    return (
      <Button variant="ghost" size="sm" onClick={handleShowAgain} className="text-muted-foreground">
        <Move className="w-4 h-4 mr-2" />
        How to reorder content
      </Button>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mb-6"
      >
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Move className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Drag & Drop Content</CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={handleDismiss}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <CardDescription>Personalize your feed by reordering content cards</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <MousePointer className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Desktop</h4>
                  <p className="text-xs text-muted-foreground">Hover over a card and drag the grip handle to reorder</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Mobile</h4>
                  <p className="text-xs text-muted-foreground">Long press and drag any content card to reorder</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Keyboard className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Keyboard</h4>
                  <p className="text-xs text-muted-foreground">Focus a card and use Space + Arrow keys to reorder</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  Pro Tip
                </Badge>
                <span className="text-xs text-muted-foreground">Your custom order is saved automatically</span>
              </div>
              <Button size="sm" onClick={handleDismiss}>
                Got it!
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
