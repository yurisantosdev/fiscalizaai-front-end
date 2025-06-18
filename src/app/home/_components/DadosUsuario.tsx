import React from 'react'
import { useSelector } from 'react-redux'
import { UsuarioConsultaType } from '@/types/UsuariosType'

export default function DadosUsuario() {
  const user: UsuarioConsultaType = useSelector(
    (state: any) => state.userReducer
  )

  return (
    <div className="w-max m-auto mt-2 flex justify-between items-center gap-8 rounded-md">
      <div>
        <span className="flex justify-start items-center gap-2 -mt-2">
          <p className="text-black font-bold">Olá,</p>
          <div>
            <p className="text-black font-extralight truncate md:max-w-full max-w-[200px]">
              {user.usnome && user.usnome}
            </p>
          </div>
        </span>
      </div>
    </div>
  )
}
