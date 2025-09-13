"use client"

import { cn } from "@/lib/utils"
import { useRef, useState } from "react"

export type DraggableItemProps = {
  item: { id: string; label: string }
  isSelected?: boolean
  onSelect?: () => void
}

export function DraggableItem({ item, isSelected, onSelect }: DraggableItemProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  return (
    <button
      ref={ref}
      type="button"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", item.id)
        e.dataTransfer.effectAllowed = "move"
        setIsDragging(true)
      }}
      onDragEnd={() => setIsDragging(false)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelect?.()
        }
      }}
      onClick={onSelect}
      aria-pressed={!!isSelected}
      className={cn(
        "select-none rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all duration-300 cursor-grab active:cursor-grabbing",
        "bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-slate-600 text-slate-200 backdrop-blur-sm",
        "hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/25 hover:border-cyan-500/50 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-lime-500/20",
        "active:scale-95 transform-gpu",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900",
        isSelected &&
          "border-lime-500 bg-gradient-to-r from-lime-500/30 to-cyan-500/30 text-lime-400 shadow-lg shadow-lime-500/30 scale-105",
        isDragging && "opacity-50 rotate-3 scale-110",
      )}
    >
      {item.label}
    </button>
  )
}
