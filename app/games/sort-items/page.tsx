import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SortItemsGame } from "@/components/sort-items-game"

export default function SortItemsPage() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-auto">
      <div className="min-h-screen w-full px-4 py-6">
        <header className="mb-6 flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h1 className="text-pretty text-3xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-lime-400 bg-clip-text text-transparent">
              Sort Items
            </h1>
            <p className="text-slate-300 mt-2 text-lg">
              Put each item into the correct category. Drag and drop, or select an item and use the "Place here"
              buttons.
            </p>
          </div>
          <Button
            variant="outline"
            asChild
            className="hover:scale-105 transition-all duration-200 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 bg-transparent"
          >
            <Link href="/">Back to Games</Link>
          </Button>
        </header>

        <SortItemsGame />
      </div>
    </div>
  )
}
