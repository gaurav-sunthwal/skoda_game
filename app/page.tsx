import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-pretty text-3xl font-semibold tracking-tight">Games</h1>
        <p className="text-muted-foreground mt-2">A growing collection of mini games. Click a card to start playing.</p>
      </header>

      <section aria-label="Available games">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Card className="flex flex-col overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg">
            <div className="h-28 w-full bg-muted ring-2 ring-primary/30">
              <img src="/images/fast-moving.png" alt="Sorting game preview" className="h-full w-full object-cover" />
            </div>
            <CardHeader>
              <CardTitle className="text-balance text-primary">Sort Items</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Place items into Fast, Mid, and Slow categories. Drag and drop, or select and place.
            </CardContent>
            <CardFooter className="mt-auto">
              <Button asChild className="hover:scale-105 transition-transform">
                <Link href="/games/sort-items">Play</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </main>
  )
}
