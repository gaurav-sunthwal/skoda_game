"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"

type CategoryId = "Fast" | "Mid" | "Slow"

const colorClasses = (id: CategoryId) => {
  switch (id) {
    case "Fast":
      return {
        text: "text-lime-400",
        border: "border-lime-500",
        dash: "border-lime-500/40",
        bgSoft: "bg-lime-500/20",
        ring: "ring-lime-500/50",
        shadow: "shadow-lime-500/25",
        gradient: "from-lime-500/10 to-lime-500/5",
      }
    case "Mid":
      return {
        text: "text-pink-400",
        border: "border-pink-500",
        dash: "border-pink-500/40",
        bgSoft: "bg-pink-500/20",
        ring: "ring-pink-500/50",
        shadow: "shadow-pink-500/25",
        gradient: "from-pink-500/10 to-pink-500/5",
      }
    case "Slow":
    default:
      return {
        text: "text-orange-400",
        border: "border-orange-500",
        dash: "border-orange-500/40",
        bgSoft: "bg-orange-500/20",
        ring: "ring-orange-500/50",
        shadow: "shadow-orange-500/25",
        gradient: "from-orange-500/10 to-orange-500/5",
      }
  }
}

export function DropZone({
  category,
  items,
  hasSelection,
  onDropItem,
  onPlaceSelected,
  feedback,
}: {
  category: { id: CategoryId; label: string }
  items: { id: string; label: string; category: CategoryId }[]
  hasSelection: boolean
  onDropItem: (itemId: string | null) => void
  onPlaceSelected: () => void
  feedback: "correct" | "wrong" | null
}) {
  const [isOver, setIsOver] = useState(false)
  const colors = colorClasses(category.id)

  return (
    <Card
      role="region"
      aria-label={`${category.label} drop zone`}
      className={cn(
        "transition-all duration-300 hover:shadow-2xl transform-gpu bg-slate-900/50 backdrop-blur-sm border-2",
        isOver ? colors.border : "border-slate-700",
        isOver && "ring-4 ring-offset-2 ring-offset-slate-900 scale-105",
        isOver && colors.ring,
        isOver && colors.shadow,
        "hover:scale-102",
      )}
      onDragOver={(e) => {
        e.preventDefault()
        setIsOver(true)
        e.dataTransfer.dropEffect = "move"
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsOver(false)
        const id = e.dataTransfer.getData("text/plain")
        onDropItem(id || null)
      }}
    >
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className={cn(
              "h-4 w-4 rounded-full border-2 animate-pulse",
              colors.border,
              colors.bgSoft,
              colors.shadow,
              "shadow-lg",
            )}
          />
          <CardTitle className={cn("text-xl font-bold tracking-wide", colors.text)}>{category.label}</CardTitle>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={onPlaceSelected}
          disabled={!hasSelection}
          className={cn(
            colors.text,
            colors.border,
            "hover:scale-110 transition-all duration-300 font-semibold",
            hasSelection && colors.bgSoft,
            hasSelection && colors.shadow,
            hasSelection && "shadow-lg animate-pulse",
          )}
        >
          Place Here
        </Button>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "min-h-32 rounded-xl border-2 border-dashed p-4 transition-all duration-300",
            colors.dash,
            isOver && colors.bgSoft,
            isOver && "bg-gradient-to-br",
            isOver && colors.gradient,
            "bg-slate-800/30",
          )}
        >
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-24 text-slate-400">
              <div className="text-2xl mb-2">📦</div>
              <p className="text-sm font-medium">Drop items here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {items.map((it, index) => (
                <div
                  key={it.id}
                  className={cn(
                    "rounded-lg border-2 px-3 py-2 text-sm font-medium shadow-lg animate-in slide-in-from-left-2 duration-300",
                    colors.border,
                    colors.bgSoft,
                    colors.text,
                    colors.shadow,
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {it.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {feedback === "wrong" && (
          <div className="mt-3 flex items-center gap-2 text-red-400 animate-in slide-in-from-bottom-2 duration-300">
            <span className="text-lg">❌</span>
            <p className="text-sm font-semibold">Try again!</p>
          </div>
        )}
        {feedback === "correct" && (
          <div className="mt-3 flex items-center gap-2 text-lime-400 animate-in slide-in-from-bottom-2 duration-300">
            <span className="text-lg animate-bounce">✅</span>
            <p className="text-sm font-semibold">Perfect!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
