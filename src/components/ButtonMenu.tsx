import { ButtonMenuInterface } from '@/Interfaces/ButtonMenuInterface'
import React from 'react'

export default function ButtonMenu({
  icon,
  title,
  selecionado,
  ...props
}: ButtonMenuInterface) {
  return (
    <button
      {...props}
      className={`cursor-pointer rounded-full active:scale-90 hover:bg-gray-1100/40 p-2 duration-200 ${
        selecionado ? 'text-blue-1000' : 'text-white'
      } ${props.className ?? ''}`}
    >
      {icon}
      <p className="text-xs text-center select-none">{title}</p>
    </button>
  )
}
