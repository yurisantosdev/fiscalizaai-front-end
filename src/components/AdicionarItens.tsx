import React from 'react'
import { PlusCircle } from '@phosphor-icons/react'
import { AuthUser } from '@/services/auth'
import { useRouter } from 'next/navigation'

export default function AdicionarItens({}) {
  AuthUser()
  const router = useRouter()

  return (
    <details className="dropdown dropdown-top dropdown-end bottom-[2%] md:right-[2%] right-[6%] fixed z-40">
      <summary
        onClick={() => {
          router.push('/registrarProblema')
        }}
        className="m-1 bg-orange-1000 rounded-full md:w-16 md:h-16 w-10 h-10 flex justify-center items-center bg-gradient-to-r to-orange-1000 from-orange-600 hover:to-orange-600 hover:from-orange-1000 hover:text-white transition-all duration-700 cursor-pointer active:scale-90 transform hover:scale-110">
        <PlusCircle className="text-white" size={50} />
      </summary>
    </details>
  )
}
