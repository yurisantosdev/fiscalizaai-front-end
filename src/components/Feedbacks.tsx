import React from 'react'
import { Question } from '@phosphor-icons/react'
import { AuthUser } from '@/services/auth'
import { UsuarioConsultaType } from '@/types/UsuariosType'
import { useSelector } from 'react-redux'
import { CLickLabel } from '@/services/clickLabel'

export default function Feedbacks() {
  AuthUser()
  const user: UsuarioConsultaType = useSelector(
    (state: any) => state.userReducer
  )

  return (
    user.usmaster && (
      <div
        className="bottom-[2%] md:left-[2%] left-[6%] fixed z-40 tooltip"
        data-tip="Feedback">
        <span
          onClick={() => {
            CLickLabel('modalFeedbackUsuario')
          }}
          className="m-1 rounded-full md:w-14 md:h-14 w-10 h-10 flex justify-center items-center bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-teal-500 hover:to-cyan-600 hover:text-white transition-all duration-700 cursor-pointer active:scale-90 transform hover:scale-110">
          <Question className="text-white" size={40} />
        </span>
      </div>
    )
  )
}
