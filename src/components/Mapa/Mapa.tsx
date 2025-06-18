import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'
import '@/styles/markercluster.css'
import { useMapEvents } from 'react-leaflet'

const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false }
)

const TileLayer = dynamic(
  () => import('react-leaflet').then(mod => mod.TileLayer),
  { ssr: false }
)

const MarkerClusterGroup = dynamic(
  () => import('react-leaflet-markercluster').then(mod => mod.default),
  { ssr: false }
) as React.ComponentType<{
  children?: React.ReactNode
  chunkedLoading?: boolean
  maxClusterRadius?: number
  spiderfyOnMaxZoom?: boolean
  showCoverageOnHover?: boolean
  zoomToBoundsOnClick?: boolean
  removeOutsideVisibleBounds?: boolean
  animate?: boolean
}>

interface MapaProps {
  children?: React.ReactNode
  className?: string
  locAtual?: boolean
  position: [number, number]
}

function MapEvents() {
  useMapEvents({
    contextmenu: e => {
      const { lat, lng } = e.latlng
      const url = `https://www.google.com/maps?q=${lat},${lng}`
      window.open(url, '_blank')
    }
  })
  return null
}

export default function Mapa({ children, className, position }: MapaProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className={`${className} bg-gray-200 animate-pulse rounded-md`} />
    )
  }

  return (
    <div className={className}>
      <MapContainer
        center={position}
        zoom={13}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <MapEvents />
        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={50}
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={false}
          zoomToBoundsOnClick={true}
          removeOutsideVisibleBounds={true}
          animate={true}
        >
          {children}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  )
}
