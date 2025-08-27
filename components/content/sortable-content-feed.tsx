"use client"

import { useState } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from "@dnd-kit/sortable"
import { restrictToParentElement } from "@dnd-kit/modifiers"
import { useAppDispatch } from "@/lib/hooks"
import { reorderContent } from "@/lib/slices/contentSlice"
import { DraggableContentCard } from "./draggable-content-card"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import type { ContentItem } from "@/lib/slices/contentSlice"

interface SortableContentFeedProps {
  items: ContentItem[]
  layout: "grid" | "list"
}

export function SortableContentFeed({ items, layout }: SortableContentFeedProps) {
  const dispatch = useAppDispatch()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [draggedItem, setDraggedItem] = useState<ContentItem | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Minimum distance before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveId(active.id as string)
    const item = items.find((item) => item.id === active.id)
    setDraggedItem(item || null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id)
      const newIndex = items.findIndex((item) => item.id === over.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        dispatch(reorderContent({ oldIndex, newIndex }))
      }
    }

    setActiveId(null)
    setDraggedItem(null)
  }

  const handleDragCancel = () => {
    setActiveId(null)
    setDraggedItem(null)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      modifiers={[restrictToParentElement]}
    >
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={layout === "grid" ? rectSortingStrategy : verticalListSortingStrategy}
      >
        <motion.div
          className={cn(
            "gap-6",
            layout === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "flex flex-col space-y-4",
          )}
          layout
        >
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <DraggableContentCard item={item} layout={layout} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </SortableContext>

      {/* Drag Overlay */}
      <DragOverlay dropAnimation={{ duration: 200, easing: "ease-out" }}>
        {draggedItem && <DraggableContentCard item={draggedItem} layout={layout} isDragOverlay />}
      </DragOverlay>
    </DndContext>
  )
}
