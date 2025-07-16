import React from 'react'
import { Info } from '@phosphor-icons/react'
import { AuthUser } from '@/services/auth'
import { UsuarioConsultaType } from '@/types/UsuariosType'
import { useSelector } from 'react-redux'
import { CLickLabel } from '@/services/clickLabel'

export default function AjudaUsuario() {
  AuthUser()
  const user: UsuarioConsultaType = useSelector(
    (state: any) => state.userReducer
  )

  return (
    user.usmaster && (
      <div
        className="bottom-[2%] md:right-[2%] right-[6%] fixed z-40 tooltip tooltip-left"
        data-tip="Ajuda e informações">
        <span
          onClick={() => {
            CLickLabel('modalAjudaUsuario')
          }}
          className="m-1 bg-orange-1000 rounded-full w-14 h-14 flex justify-center items-center bg-gradient-to-r to-orange-1000 from-orange-600 hover:to-orange-600 hover:from-orange-1000 hover:text-white transition-all duration-700 cursor-pointer">
          <Info className="text-white" size={40} />
        </span>
      </div>
    )
  )
}
