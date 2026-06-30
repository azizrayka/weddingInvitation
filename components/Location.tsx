'use client'
import { Navigation } from "lucide-react"

interface LocationMinimalProps {
  name: string
  address: string
  mapsUrl: string
}

const LocationMinimal = ({ name, address, mapsUrl }: LocationMinimalProps) => {
  const embedSrc = `${mapsUrl}${mapsUrl.includes("?") ? "&" : "?"}output=embed`

  return (
    <div className="w-full rounded-xl overflow-hidden border border-white/10 bg-zinc-900/40 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row">
        {/* Map */}
        <div className="relative w-full sm:w-48 h-48 sm:h-auto pointer-events-none">
          <iframe
            title={`Map showing ${name}`}
            src={embedSrc}
            width="100%"
            height="100%"
            style={{ border: 0, pointerEvents: 'auto' }}
            loading="lazy"
            className="absolute inset-0 w-full h-full grayscale-[15%]"
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between gap-4">
          <div>
            <h4 className="font-semibold text-white text-lg">{name}</h4>
            <p className="text-sm text-amber-200/80 mt-1">{address}</p>
          </div>
          
          <button
            onClick={() => window.open(mapsUrl, "_blank", "noopener,noreferrer")}
            className="inline-flex items-center justify-center gap-2 rounded-lg w-full bg-white text-black font-medium px-4 py-2 text-sm hover:bg-zinc-200 transition-colors self-start"
          >
            <Navigation className="w-4 h-4" />
            Directions
          </button>
        </div>
      </div>
    </div>
  )
}

export default LocationMinimal