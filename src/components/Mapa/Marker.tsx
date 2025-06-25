import { MarkerMapaInterface } from '@/Interfaces/MarkerMapaInterface'
import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import L from 'leaflet'

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  {
    ssr: false
  }
)

const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), {
  ssr: false
})

function getStatusColor(status: string) {
  switch (status) {
    case 'PENDENTE':
      return '#FEF08A'
    case 'EM_ANDAMENTO':
      return '#FED7AA'
    case 'RESOLVIDO':
      return '#BBF7D0'
    case 'TODOS':
      return '#F3F4F6'
    case 'EM_ANALISE':
      return '#DBEAFE'
    case 'CORRIGIR':
      return '#FCA5A5'
    default:
      return '#a6cfff'
  }
}

function getStatusSymbol(status: string) {
  switch (status) {
    case 'PENDENTE':
      return '⚠️'
    case 'EM_ANDAMENTO':
      return '🚧'
    case 'RESOLVIDO':
      return '✅'
    case 'EM_ANALISE':
      return '🔍'
    default:
      return '•'
  }
}

function generateMarkerHTML(color: string, status: string) {
  const symbol = getStatusSymbol(status)
  return `
    <div style="
      position: relative;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style='
        position: absolute;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: radial-gradient(circle, ${color}33 60%, transparent 100%);
        box-shadow: 0 2px 8px 0 ${color}55;
        z-index: 1;
      '></div>
      <div style='
        position: relative;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: linear-gradient(145deg, ${color} 70%, #a6cfff 100%);
        border: 2px solid #fff;
        box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
        color: #222;
        z-index: 2;
      '>${symbol}</div>
    </div>
  `
}

export default function MarkerMapa({
  position,
  dragedFunction,
  childrenPop,
  tipoIcone,
  status
}: MarkerMapaInterface & { status?: string }) {
  const [showPopup, setShowPopup] = useState(false)

  const color = getStatusColor(status || '')
  const html = generateMarkerHTML(color, status || '')

  const customIcon = new L.DivIcon({
    html,
    className: 'custom-marker-div',
    iconSize: [50, 50],
    iconAnchor: [24, 38],
    popupAnchor: [0, -18]
  })

  return position ? (
    <Marker
      position={position}
      draggable={dragedFunction !== undefined}
      icon={customIcon}
      eventHandlers={{
        dragend: dragedFunction,
        click: () => setShowPopup(true)
      }}>
      {childrenPop && showPopup && (
        <Popup className="w-[300px]" position={position}>
          {childrenPop}
        </Popup>
      )}
    </Marker>
  ) : null
}
