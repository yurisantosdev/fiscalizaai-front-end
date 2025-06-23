import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'
import '@/styles/markercluster.css'
import { useMapEvents, useMap } from 'react-leaflet'

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)

const MarkerClusterGroup = dynamic(
  () => import('react-leaflet-markercluster').then((mod) => mod.default),
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
    contextmenu: (e) => {
      const { lat, lng } = e.latlng
      const url = `https://www.google.com/maps?q=&layer=c&cbll=${lat},${lng}`
      window.open(url, '_blank')
    }
  })
  return null
}

function MapTypeControl({
  mapType,
  onMapTypeChange
}: {
  mapType: 'satellite' | 'normal'
  onMapTypeChange: (type: 'satellite' | 'normal') => void
}) {
  const map = useMap()

  const handleMapTypeChange = () => {
    const newType = mapType === 'satellite' ? 'normal' : 'satellite'
    onMapTypeChange(newType)
  }

  return (
    <div className="absolute top-4 right-4 z-[1000]">
      <button
        onClick={handleMapTypeChange}
        className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow-lg transition-colors duration-200 cursor-pointer"
        title={
          mapType === 'satellite'
            ? 'Mudar para mapa normal'
            : 'Mudar para satélite'
        }>
        {mapType === 'satellite' ? '🗺️ Mapa' : '🛰️ Satélite'}
      </button>
    </div>
  )
}

export default function Mapa({ children, className, position }: MapaProps) {
  const [mounted, setMounted] = useState(false)
  const [mapType, setMapType] = useState<'satellite' | 'normal'>('normal')

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleMapTypeChange = (type: 'satellite' | 'normal') => {
    setMapType(type)
  }

  if (!mounted) {
    return (
      <div className={`${className} bg-gray-200 animate-pulse rounded-md`} />
    )
  }

  return (
    <div className={`${className} relative`}>
      <MapContainer
        center={position}
        zoom={12}
        style={{ width: '100%', height: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={
            mapType === 'satellite'
              ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
              : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
          }
        />
        <MapEvents />
        <MapTypeControl
          mapType={mapType}
          onMapTypeChange={handleMapTypeChange}
        />
        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={50}
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={false}
          zoomToBoundsOnClick={true}
          removeOutsideVisibleBounds={true}
          animate={true}>
          {children}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  )
}
