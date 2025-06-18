import {
  ButtonInterface,
  ButtonIconInterface
} from '@/Interfaces/ButtonInterface'
import React from 'react'

export function Button({
  title,
  iconLeft,
  iconRight,
  ...props
}: ButtonInterface) {
  return (
    <button
      {...props}
      className={`flex justify-center items-center gap-2 p-2 rounded-md text-md active:scale-95 duration-200 bg-blue-700 hover:bg-blue-800 active:bg-blue-700 ${
        props.disabled ? 'cursor-not-allowed' : 'cursor-pointer'
      } ${props.className ?? ''}`}>
      {iconLeft}
      {title}
      {iconRight}
    </button>
  )
}

export function ButtonIcon({ icon, ...props }: ButtonIconInterface) {
  return (
    <button
      {...props}
      className={`flex justify-center items-center bg-gray-50 p-1 max-h-9 min-h-9 rounded-md cursor-pointer ${
        props.className ?? ''
      }`}>
      {icon}
    </button>
  )
}
