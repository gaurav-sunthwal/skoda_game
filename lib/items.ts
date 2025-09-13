export type Category = "Fast" | "Mid" | "Slow"
export type Item = { id: string; name: string; category: Category }

// Fast-moving (consumables, frequent wear)
const FAST: string[] = [
  "Brake pads",
  "Brake shoes",
  "Oil filters",
  "Air filters",
  "Fuel filters",
  "Spark plugs",
  "Wiper blades",
  "Clutch plates",
  "Pressure plates",
  "Drive belts",
  "Timing belts",
  "Batteries",
  "Headlight bulbs",
  "Tail light bulbs",
  "Fuses",
  "Relays",
  "Ignition coils",
  "Engine oil",
  "Coolant",
  "Transmission fluid",
  "Brake fluid",
  "Grease & lubricants",
  "Side mirrors",
  "Door handles",
  "Floor mats",
  "Washer nozzles",
]

// Mid-moving (standard replacement after usage)
const MID: string[] = [
  "Brake discs",
  "Brake drums",
  "Suspension struts",
  "Suspension bushings",
  "Alternator",
  "Starter motor",
  "Exhaust silencer",
  "Catalytic converter",
  "Radiator",
  "Rubber hoses",
  "Gearbox bearings",
  "Gearbox synchro rings",
  "Serpentine belts",
]

// Slow-moving (high-value, legacy, repairable)
const SLOW: string[] = [
  "Timing chain kits (older engines)",
  "Cylinder heads (discontinued)",
  "Manual transmission components (legacy)",
  "Differential assemblies (low-volume 4WD)",
  "Turbochargers (niche variants)",
  "ECUs for outdated models",
  "Model-specific wiring harnesses",
  "Old-style alternators/starters",
  "Obsolete engine sensors",
  "Dashboard panels (legacy interiors)",
  "Door trims (rare colors)",
  "Sunroof assemblies (older luxury)",
  "Seat mechanisms (manual)",
  "Interior switches/knobs (legacy)",
  "Leaf springs (older utility)",
  "Shocks for discontinued variants",
  "Control arms (rare chassis)",
  "AC compressors (older systems)",
  "Radiators (discontinued layouts)",
  "Heater cores (legacy)",
]

export function allItems(): Item[] {
  const map = (names: string[], category: Category): Item[] =>
    names.map((name, i) => ({
      id: `${category[0]}-${i}-${name.slice(0, 8).toLowerCase()}`,
      name,
      category,
    }))
  return [...map(FAST, "Fast"), ...map(MID, "Mid"), ...map(SLOW, "Slow")]
}
