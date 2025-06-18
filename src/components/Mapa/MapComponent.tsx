import React from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import MarkerMapa from './Marker'
import { MapaInterface } from '@/Interfaces/MapaInterface'

const MapComponent: React.FC<MapaInterface> = ({
  position,
  dragedFunction,
  children,
  locAtual
}) => {
  return (
    <MapContainer
      center={position}
      zoom={17}
      style={{ height: '100%', width: '100%', zIndex: 2 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      {locAtual && (
        <MarkerMapa position={position} dragedFunction={dragedFunction} />
      )}

      {children}
    </MapContainer>
  )
}

export default MapComponent
