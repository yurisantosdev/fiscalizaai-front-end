import { MarkerMapaInterface } from '@/Interfaces/MarkerMapaInterface'
import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import L from 'leaflet'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/icones/iconeSemFundo.png',
  iconUrl: '/icones/iconeSemFundo.png',
  shadowUrl: '/icones/iconeSemFundo.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), {
  ssr: false
})

const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), {
  ssr: false
})

export default function MarkerMapa({
  position,
  dragedFunction,
  childrenPop,
  tipoIcone
}: MarkerMapaInterface) {
  const [showPopup, setShowPopup] = useState(false)

  function defineIconeMapa(tipo: any) {
    let icone = '/icones/iconeSemFundo.png'

    switch (tipo) {
      case 'Infraestrutura e Mobilidade Urbana':
        icone = '/icones/iconeBuraco.png'
        break

      case 'Iluminação':
        icone = '/icones/iconeLuz.png'
        break

      case 'Limpeza Urbana e Coleta de Lixo':
        icone = '/icones/iconeLixo.png'
        break

      case 'Casa':
        icone = '/icones/casa.png'
        break

      default:
        icone = '/icones/iconeSemFundo.png'
        break
    }

    return icone
  }

  const customIcon = new L.Icon({
    iconUrl: defineIconeMapa(tipoIcone),
    iconSize: [40, 40],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  })

  return position ? (
    <Marker
      position={position}
      draggable={dragedFunction !== undefined}
      icon={customIcon}
      eventHandlers={{
        dragend: dragedFunction,
        click: () => setShowPopup(true)
      }}
    >
      {childrenPop && showPopup && (
        <Popup className="w-[300px]" position={position}>
          {childrenPop}
        </Popup>
      )}
    </Marker>
  ) : null
}
