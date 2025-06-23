import React, { useState } from 'react'
import { Warning, PlusCircle } from '@phosphor-icons/react'
import { AuthUser } from '@/services/auth'
import ItemAdicionar from './ItemAdicionar'
import { ItemAdicionarInterface } from '@/Interfaces/ItemAdicionarInterface'
import { CLickLabel } from '@/services/clickLabel'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { setLoading } from '@/redux/loading/actions'

export default function AdicionarItens({}) {
  AuthUser()
  const { reset } = useForm()
  const router = useRouter()
  const dispatch = useDispatch()
  const [itensMenu, setItensMenu] = useState<Array<ItemAdicionarInterface>>([
    {
      icone: <Warning size={20} className="text-white" />,
      nome: 'Registrar Relato',
      link: '/registrarProblema'
    }
  ])

  return (
    <details className="dropdown dropdown-top dropdown-end bottom-[2%] md:right-[2%] right-[6%] fixed z-40">
      <summary className="m-1 bg-orange-1000 rounded-full md:w-16 md:h-16 w-12 h-12 flex justify-center items-center hover:bg-orange-1000/80 cursor-pointer active:scale-90 duration-200">
        <PlusCircle className="text-white" size={40} />
      </summary>
      <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
        {itensMenu.map((item: ItemAdicionarInterface, index: number) => {
          return (
            <ItemAdicionar
              icone={item.icone}
              nome={item.nome}
              key={index}
              onClick={() => {
                if (item.label) {
                  reset()
                  CLickLabel(item.label)
                } else if (item.link) {
                  router.push(item.link)
                } else {
                  dispatch(setLoading(true))
                  toast('Houve um erro! Por favor tente novamente!')
                }
              }}
            />
          )
        })}
      </ul>
    </details>
  )
}
