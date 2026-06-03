import { useEffect, useRef } from 'react'
import type { Establishment } from '@/types/collections'

interface EstablishmentsMapProps {
  establishments: Establishment[]
  height?: number
}

const TYPE_COLORS: Record<string, string> = {
  youth_house: '#d03238',
  youth_hostel: '#1a6070',
  sports_complex: '#2c7a4a',
  youth_camp: '#4d7f16',
  polyvalent_hall: '#c2860e',
  scientific_leisure_center: '#2ead4b',
}

const TYPE_LABELS: Record<string, string> = {
  youth_house: 'Maison de jeunes',
  youth_hostel: 'Auberge',
  sports_complex: 'Complexe sportif',
  youth_camp: 'Camp',
  polyvalent_hall: 'Salle polyvalente',
  scientific_leisure_center: 'CLS',
}

export default function EstablishmentsMap({ establishments, height = 400 }: EstablishmentsMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<unknown>(null)
  const loadedRef = useRef(false)

  const valid = establishments.filter((e) => e.latitude && e.longitude)

  useEffect(() => {
    if (loadedRef.current || valid.length === 0) return

    const loadLeaflet = async () => {
      if (typeof window === 'undefined') return
      const L = (window as unknown as Record<string, unknown>).L as Record<string, unknown> | undefined
      if (!L) {
        await new Promise<void>((resolve) => {
          const link = document.createElement('link')
          link.rel = 'stylesheet'
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
          document.head.appendChild(link)

          const script = document.createElement('script')
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
          script.onload = () => resolve()
          document.head.appendChild(script)
        })
      }

      const leaflet = (window as unknown as Record<string, unknown>).L as {
        map: (el: string | HTMLElement, opts: Record<string, unknown>) => unknown
        tileLayer: (url: string, opts: Record<string, unknown>) => { addTo: (m: unknown) => unknown }
        divIcon: (opts: Record<string, unknown>) => unknown
        marker: (coords: [number, number], opts: Record<string, unknown>) => {
          addTo: (m: unknown) => unknown
          bindTooltip: (text: string, opts: Record<string, unknown>) => unknown
        }
        featureGroup: (layers: unknown[]) => { getBounds: () => { pad: (p: number) => unknown } }
      } | undefined

      if (!leaflet || !containerRef.current) return

      const map = leaflet.map(containerRef.current, {
        center: [36.75, 5.0],
        zoom: 11,
        zoomControl: true,
        attributionControl: false,
      })

      leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
      }).addTo(map)

      const layers: unknown[] = []
      valid.forEach((e) => {
        const color = TYPE_COLORS[e.type] ?? '#d03238'
        const icon = leaflet.divIcon({
          className: '',
          html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2.5px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.5);"></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        })

        const marker = leaflet.marker([e.latitude!, e.longitude!], { icon })
        marker.addTo(map)

        const label = `${e.name} · ${TYPE_LABELS[e.type] ?? e.type} · ${e.commune}${e.phone ? ' · ' + e.phone : ''}`
        marker.bindTooltip(label, {
          direction: 'top',
          offset: [0, -10],
        })
        layers.push(marker)
      })

      if (layers.length > 1) {
        try {
          const group = leaflet.featureGroup(layers)
          const bounds = group.getBounds()
          mapRef.current = map
          ;(map as { fitBounds?: (b: unknown) => void }).fitBounds?.(bounds.pad(0.15))
        } catch {
          // fallback to default center
        }
      }

      mapRef.current = map
      loadedRef.current = true
    }

    loadLeaflet()
  }, [valid])

  if (valid.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-xl bg-surface-container"
        style={{ height }}
      >
        <p className="text-body-sm text-on-surface-variant">
          Aucun établissement avec coordonnées GPS.
        </p>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="rounded-xl border border-outline-variant"
      style={{ height, overflow: 'hidden' }}
    />
  )
}
