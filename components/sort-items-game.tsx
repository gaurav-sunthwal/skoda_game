"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DraggableItem } from "./draggable-item"
import { DropZone } from "./drop-zone"
import { allItems, type Item as SourceItem, type Category as CategoryId } from "@/lib/items"

type Item = {
  id: string
  label: string
  category: CategoryId
}

const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: "Fast", label: "Fast moving" },
  { id: "Mid", label: "Mid moving" },
  { id: "Slow", label: "Slow moving" },
]

const POINTS_CORRECT = 10
const POINTS_WRONG = 5
const LOSE_MISTAKES = 5
const LOSE_PENALTY = 10

function sample<T>(arr: T[], n: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n)
}

export function SortItemsGame() {
  const [tray, setTray] = useState<Item[]>([])
  const [zones, setZones] = useState<Record<CategoryId, Item[]>>({
    Fast: [],
    Mid: [],
    Slow: [],
  })
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [lastFeedback, setLastFeedback] = useState<"correct" | "wrong" | null>(null)
  const [showRefs, setShowRefs] = useState(false)
  const [points, setPoints] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [isLose, setIsLose] = useState(false)
  const [isWin, setIsWin] = useState(false)

  const itemsRemaining = tray.length
  const gameComplete = itemsRemaining === 0

  const buildRoundItems = (): Item[] => {
    const src = allItems()
    const fast = sample(
      src.filter((i) => i.category === "Fast"),
      3,
    )
    const mid = sample(
      src.filter((i) => i.category === "Mid"),
      3,
    )
    const slow = sample(
      src.filter((i) => i.category === "Slow"),
      3,
    )
    const round = [...fast, ...mid, ...slow].map<Item>((i: SourceItem) => ({
      id: i.id,
      label: i.name,
      category: i.category,
    }))
    return [...round].sort(() => Math.random() - 0.5)
  }

  const startNewRound = () => {
    const randomized = buildRoundItems()
    setTray(randomized)
    setZones({ Fast: [], Mid: [], Slow: [] })
    setAttempts(0)
    setCorrect(0)
    setSelectedItemId(null)
    setLastFeedback(null)
    setMistakes(0)
    setIsLose(false)
    setIsWin(false)
  }

  useEffect(() => {
    startNewRound()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onDropAttempt = (categoryId: CategoryId, itemId: string | null) => {
    if (isLose || isWin) return
    if (!itemId) return

    const item = tray.find((i) => i.id === itemId)
    if (!item) return

    const nextAttempts = attempts + 1
    setAttempts(nextAttempts)

    if (item.category === categoryId) {
      const nextCorrect = correct + 1

      const newTray = tray.filter((i) => i.id !== item.id)
      setTray(newTray)
      setZones((prev) => ({ ...prev, [categoryId]: [...prev[categoryId], item] }))

      setCorrect(nextCorrect)
      setSelectedItemId(null)
      setLastFeedback("correct")

      const perfBonus = Math.max(0, 3 - mistakes)
      setPoints((p) => p + POINTS_CORRECT + perfBonus)

      if (newTray.length === 0) {
        const nextAccuracy = Math.round((nextCorrect / nextAttempts) * 100)
        const winBonus = Math.round(nextAccuracy / 10)
        const flawlessBonus = mistakes === 0 ? 10 : 0
        setPoints((p) => p + winBonus + flawlessBonus)
        setIsWin(true)
      }
      return
    }

    const nextMistakes = mistakes + 1
    setMistakes(nextMistakes)
    setSelectedItemId(null)
    setLastFeedback("wrong")
    setPoints((p) => Math.max(0, p - POINTS_WRONG))

    if (nextMistakes >= LOSE_MISTAKES) {
      setIsLose(true)
      setPoints((p) => Math.max(0, p - LOSE_PENALTY))
    }
  }

  const handlePlaceSelected = (categoryId: CategoryId) => {
    onDropAttempt(categoryId, selectedItemId)
  }

  const accuracy = useMemo(() => {
    if (attempts === 0) return 0
    return Math.round((correct / attempts) * 100)
  }, [attempts, correct])

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-8">
      {/* Enhanced legend and controls */}
      <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
        <div className="space-y-4">
          <p className="text-slate-300 text-base">
            Drag items into the correct category. Or select an item, then use "Place here". Categories are color-coded.
          </p>
          <ul className="flex flex-wrap gap-4 text-sm">
            <li className="rounded-full bg-lime-500/20 px-4 py-2 text-lime-400 ring-2 ring-lime-500/40 shadow-lg shadow-lime-500/20 animate-pulse">
              Fast Moving
            </li>
            <li className="rounded-full bg-pink-500/20 px-4 py-2 text-pink-400 ring-2 ring-pink-500/40 shadow-lg shadow-pink-500/20 animate-pulse">
              Mid Moving
            </li>
            <li className="rounded-full bg-orange-500/20 px-4 py-2 text-orange-400 ring-2 ring-orange-500/40 shadow-lg shadow-orange-500/20 animate-pulse">
              Slow Moving
            </li>
          </ul>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="text-lg font-mono bg-gradient-to-r from-cyan-400 to-lime-400 bg-clip-text text-transparent font-bold">
            Points: {points}
          </div>
          <div className="text-base font-mono text-slate-300">
            Correct: {correct}/{attempts} ({accuracy}%)
          </div>
          <div className="text-base font-mono text-slate-300">Lives: {Math.max(0, LOSE_MISTAKES - mistakes)}</div>
          <Button
            variant="outline"
            onClick={startNewRound}
            className="hover:scale-110 transition-all duration-300 bg-gradient-to-r from-cyan-500/20 to-lime-500/20 border-cyan-500/50 text-cyan-400 hover:shadow-lg hover:shadow-cyan-500/25"
          >
            🎲 New Round
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowRefs((s) => !s)}
            className="hover:scale-110 transition-all duration-300 border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            {showRefs ? "Hide" : "Show"} References
          </Button>
        </div>
      </div>

      {/* Enhanced tray with animations */}
      <section aria-label="Item tray" className="flex flex-col gap-4">
        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-100 flex items-center gap-3">
              <span className="text-3xl">🎯</span>
              Items to Sort
              <span className="text-lg text-slate-400 font-normal">({itemsRemaining} remaining)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tray.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4 animate-bounce">🎉</div>
                <p className="text-xl text-lime-400 font-semibold">All items sorted perfectly!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {tray.map((item, index) => (
                  <div
                    key={item.id}
                    className="animate-in slide-in-from-bottom-4 duration-300"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <DraggableItem
                      item={{ id: item.id, label: item.label }}
                      isSelected={selectedItemId === item.id}
                      onSelect={() => setSelectedItemId((cur) => (cur === item.id ? null : item.id))}
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Enhanced zones with better spacing */}
      <section aria-label="Categories" className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {CATEGORIES.map((cat, index) => (
          <div
            key={cat.id}
            className="animate-in slide-in-from-bottom-6 duration-500"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <DropZone
              category={cat}
              items={zones[cat.id]}
              hasSelection={!!selectedItemId}
              onDropItem={(itemId) => onDropAttempt(cat.id, itemId)}
              onPlaceSelected={() => handlePlaceSelected(cat.id)}
              feedback={lastFeedback}
            />
          </div>
        ))}
      </section>

      {/* Enhanced completion banners */}
      {isWin && (
        <div
          role="status"
          aria-live="polite"
          className="animate-in slide-in-from-bottom-4 duration-500 rounded-xl border-2 border-lime-500/50 bg-gradient-to-r from-lime-500/20 to-cyan-500/20 p-6 text-center shadow-2xl shadow-lime-500/25"
        >
          <div className="text-4xl mb-3 animate-bounce">🏆</div>
          <div className="text-xl font-bold text-lime-400 mb-2">Victory!</div>
          <div className="text-slate-300">
            Perfect accuracy: {accuracy}%! Bonus points added. Total: {points} points.
          </div>
          <Button
            className="mt-4 bg-gradient-to-r from-lime-500 to-cyan-500 hover:scale-105 transition-all duration-300 shadow-lg"
            onClick={startNewRound}
          >
            🎮 Play Again
          </Button>
        </div>
      )}

      {isLose && (
        <div
          role="alert"
          aria-live="assertive"
          className="animate-in slide-in-from-bottom-4 duration-500 rounded-xl border-2 border-red-500/50 bg-gradient-to-r from-red-500/20 to-orange-500/20 p-6 text-center shadow-2xl shadow-red-500/25"
        >
          <div className="text-4xl mb-3 animate-pulse">💥</div>
          <div className="text-xl font-bold text-red-400 mb-2">Game Over!</div>
          <div className="text-slate-300">Too many mistakes. {LOSE_PENALTY} points deducted.</div>
          <Button
            className="mt-4 bg-gradient-to-r from-red-500 to-orange-500 hover:scale-105 transition-all duration-300 shadow-lg"
            onClick={startNewRound}
          >
            🔄 Try Again
          </Button>
        </div>
      )}

      {/* Enhanced references */}
      {showRefs && (
        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-100 flex items-center gap-3">
              <span className="text-3xl">📚</span>
              Reference Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <figure className="rounded-xl border-2 border-lime-500/30 bg-slate-800/50 p-4 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-lime-500/25">
              <img
                src="/images/fast-moving.png"
                alt="Consumable spares (fast-moving) slide"
                className="h-48 w-full object-cover rounded-lg"
              />
              <figcaption className="mt-3 text-center text-lime-400 font-semibold">Fast-moving Items</figcaption>
            </figure>
            <figure className="rounded-xl border-2 border-pink-500/30 bg-slate-800/50 p-4 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-pink-500/25">
              <img
                src="/images/mid-moving.png"
                alt="Replacement spares (mid-moving) slide"
                className="h-48 w-full object-cover rounded-lg"
              />
              <figcaption className="mt-3 text-center text-pink-400 font-semibold">Mid-moving Items</figcaption>
            </figure>
            <figure className="rounded-xl border-2 border-orange-500/30 bg-slate-800/50 p-4 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-orange-500/25">
              <img
                src="/images/slow-moving.png"
                alt="Rotable spares (slow-moving) slide"
                className="h-48 w-full object-cover rounded-lg"
              />
              <figcaption className="mt-3 text-center text-orange-400 font-semibold">Slow-moving Items</figcaption>
            </figure>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
