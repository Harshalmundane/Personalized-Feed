"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { ContentCard } from "./content-card"
import { motion } from "framer-motion"
import { GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ContentItem } from "@/lib/slices/contentSlice"

interface DraggableContentCardProps {
  item: ContentItem
  layout: "grid" | "list"
  isDragOverlay?: boolean
}

export function DraggableContentCard({ item, layout, isDragOverlay = false }: DraggableContentCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  if (isDragOverlay) {
    return (
      <motion.div
        initial={{ scale: 1.05, rotate: 5 }}
        animate={{ scale: 1.05, rotate: 5 }}
        className="opacity-90 shadow-2xl"
      >
        <ContentCard item={item} layout={layout} />
      </motion.div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group transition-all duration-200",
        isDragging && "opacity-50 scale-95",
        layout === "list" && "touch-none",
      )}
      {...attributes}
    >
      {/* Drag Handle */}
      <div
        {...listeners}
        className={cn(
          "absolute z-10 cursor-grab active:cursor-grabbing transition-opacity",
          "opacity-0 group-hover:opacity-100",
          layout === "grid"
            ? "top-2 right-2 p-1 bg-background/80 backdrop-blur-sm rounded-md shadow-sm"
            : "left-2 top-1/2 -translate-y-1/2 p-1 bg-background/80 backdrop-blur-sm rounded-md shadow-sm",
        )}
        aria-label="Drag to reorder"
      >
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>

      {/* Content Card */}
      <ContentCard item={item} layout={layout} />

      {/* Drag Indicator */}
      {isDragging && <div className="absolute inset-0 border-2 border-dashed border-primary rounded-lg bg-primary/5" />}
    </div>
  )
}

export { DraggableContentCard as default }
