import React from 'react'
import Modal from './Modal'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from './Button'
import { Check, X } from '@phosphor-icons/react'
import { CLickLabel } from '@/services/clickLabel'
import toast from 'react-hot-toast'
import { cancelarProblema } from '@/store/Problemas'
import { setLoading } from '@/redux/loading/actions'
import {
  CancelarProblemaType,
} from '@/types/ProblemasType'

interface ModalConfirmacaoCancelarProblemaProps {
  decodigo: string
}

export default function ModalConfirmacaoCancelarProblema({
  decodigo
}: ModalConfirmacaoCancelarProblemaProps) {
  const loading = useSelector((state: any) => state.loadingReducer.loading)
  const dispatch = useDispatch()

  async function onCancelarProblema() {
    if (decodigo) {
      dispatch(setLoading(true))
      const obj: CancelarProblemaType = {
        decodigo: decodigo
      }
      const response = await cancelarProblema(obj)

      if (response != undefined) {
        CLickLabel('modalConfirmacaoCancelarProblema')
        dispatch(setLoading(false))
        toast.success('Problema cancelado com sucesso!')
        window.dispatchEvent(new Event('relatoAtualizado'))
      } else {
        dispatch(setLoading(false))
      }
    }
  }

  return (
    <Modal
      name="Atenção!"
      htmlFor="modalConfirmacaoCancelarProblema"
      loading={loading}
    >
      <p className="font-bold text-lg text-center text-black">
        Você tem certeza desta ação?
      </p>
      <p className="text-lg text-center font-extralight text-black">
        Após a confirmação desta ação, o item será excluído permanentemente e
        não será mais possível recuperar essa informação.
      </p>

      <div className="flex justify-center items-center gap-3 mt-5">
        <Button
          title="Não"
          className="w-full m-auto bg-red-700 hover:bg-red-700/80 active:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
          iconLeft={<X size={20} />}
          onClick={() => {
            CLickLabel('modalConfirmacaoCancelarProblema')
          }}
        />

        <Button
          title="Sim"
          className="w-full m-auto bg-green-700 hover:bg-green-700/80 active:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
          iconLeft={<Check size={20} />}
          onClick={onCancelarProblema}
        />
      </div>
    </Modal>
  )
}
