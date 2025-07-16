import React from 'react'
import { ChatTeardropDots } from '@phosphor-icons/react'
import { CLickLabel } from '@/services/clickLabel'

export default function Feedbacks() {
  return (
    <div
      className="bottom-[2%] md:left-[2%] left-[6%] fixed z-40 tooltip"
      data-tip="Feedback">
      <span
        onClick={() => {
          CLickLabel('modalFeedbackUsuario')
        }}
        className="m-1 rounded-full w-14 h-14 flex justify-center items-center bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-teal-500 hover:to-cyan-600 hover:text-white transition-all duration-700 cursor-pointer">
        <ChatTeardropDots className="text-white" size={40} />
      </span>
    </div>
  )
}
