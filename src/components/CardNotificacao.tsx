import React from 'react'
import { CardNotificacaoInterface } from '@/Interfaces/CardNotificacaoInterface'
import { CalendarDots, ChatCircleDots } from '@phosphor-icons/react'

export default function CardNotificacao({
  lida,
  mensagem,
  quando,
  ...props
}: CardNotificacaoInterface) {
  return (
    <div
      {...props}
      className={`p-2 rounded-md w-full mb-3 relative ${
        lida
          ? 'bg-gray-1100 border border-gray-1300'
          : 'bg-blue-1000 border border-white cursor-pointer active:scale-95 duration-300'
      } ${props.className ?? ''}`}
    >
      <div className="flex justify-start items-center gap-2 mt-2">
        <ChatCircleDots size={18} className="text-white" weight="thin" />

        <div className="tooltip tooltip-bottom w-[80%]" data-tip={mensagem}>
          <p className="truncate max-w-[80%]">{mensagem}</p>
        </div>
      </div>

      <div className="flex justify-start items-center gap-2 mt-2">
        <CalendarDots size={18} className="text-white" weight="thin" />

        <p className="text-white truncate w-[80%] text-sm italic  font-light">
          {quando}
        </p>
      </div>

      {!lida && (
        <span className="absolute right-2 top-2 bg-red-500 text-white text-xs font-bold rounded-full p-1 w-max flex items-center justify-center">
          Nova
        </span>
      )}
    </div>
  )
}
