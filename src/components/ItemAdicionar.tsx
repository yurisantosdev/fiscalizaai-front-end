import { ItemAdicionarInterface } from '@/Interfaces/ItemAdicionarInterface'
import React from 'react'

export default function ItemAdicionar({
  icone,
  nome,
  ...props
}: ItemAdicionarInterface) {
  return (
    <li {...props}>
      <div className="flex justify-between items-center">
        <p>{nome}</p>
        {icone}
      </div>
    </li>
  )
}
