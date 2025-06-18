import { TextInterface } from '@/Interfaces/TextInterface'
import React from 'react'

export default function TextRequired({ message, ...props }: TextInterface) {
  return (
    <p
      {...props}
      className={`text-sm -mt-3 mb-3 text-red-600 italic font-medium ${
        props.className ?? ''
      }`}
    >
      {message ? message : 'Informe esse campo!'}
    </p>
  )
}
