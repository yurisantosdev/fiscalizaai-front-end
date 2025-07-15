import React from 'react'
import { Brain } from '@phosphor-icons/react'
import { AuthUser } from '@/services/auth'
import { useRouter } from 'next/navigation'
import { UsuarioConsultaType } from '@/types/UsuariosType'
import { useSelector } from 'react-redux'

export default function KauaneAI() {
  AuthUser()
  const router = useRouter()
  const user: UsuarioConsultaType = useSelector(
    (state: any) => state.userReducer
  )

  return (
    user.usmaster && (
      <div
        className="bottom-[2%] md:right-[2%] right-[6%] fixed z-40 tooltip"
        data-tip="KauaneAI">
        <span
          onClick={() => {
            router.push('/kauaneai')
          }}
          className="m-1 bg-orange-1000 rounded-full md:w-14 md:h-14 w-10 h-10 flex justify-center items-center bg-gradient-to-r to-orange-1000 from-orange-600 hover:to-orange-600 hover:from-orange-1000 hover:text-white transition-all duration-700 cursor-pointer active:scale-90 transform hover:scale-110">
          <Brain className="text-white" size={40} />
        </span>
      </div>
    )
  )
}
