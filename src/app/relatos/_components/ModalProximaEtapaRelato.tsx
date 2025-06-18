import { Button } from '@/components/Button'
import Modal from '@/components/Modal'
import { setLoading } from '@/redux/loading/actions'
import { CLickLabel } from '@/services/clickLabel'
import { atualizarStatusRelato } from '@/store/Problemas'
import { AtualizarStatusRelatoType } from '@/types/ProblemasType'
import { Check, X } from '@phosphor-icons/react'
import React from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'

interface ModalProximaEtapaRelatoProps {
  decodigo: string
}

export default function ModalProximaEtapaRelato({
  decodigo
}: ModalProximaEtapaRelatoProps) {
  const dispatch = useDispatch()
  const loading = useSelector((state: any) => state.loadingReducer.loading)

  async function onProxiamEtapa() {
    dispatch(setLoading(true))
    const obj: AtualizarStatusRelatoType = {
      decodigo,
      destatus: 'EM_ANDAMENTO'
    }
    const response = await atualizarStatusRelato(obj)

    if (response != undefined) {
      toast.success('Alterado status de relato com sucesso!')
      dispatch(setLoading(false))
      CLickLabel('modalProximaEtapaRelato')

      window.dispatchEvent(new CustomEvent('relatoAtualizado'))
    } else {
      dispatch(setLoading(false))
      toast.error('Erro ao alterar status do relato')
    }
  }

  return (
    <Modal
      htmlFor="modalProximaEtapaRelato"
      name="Próxima etapa"
      loading={loading}>
      <p className="font-bold text-lg text-center text-black">
        Você tem certeza desta ação?
      </p>
      <span className="text-lg text-center font-extralight text-black flex justify-center items-center gap-1">
        <p>Após a confirmação, o relato será alterado para o status</p>
        <p className="font-bold">EM ANDAMENTO!</p>
      </span>

      <div className="flex justify-center items-center gap-3 mt-5">
        <Button
          title="Não"
          className="w-full m-auto bg-red-700 hover:bg-red-700/80 active:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
          iconLeft={<X size={20} />}
          onClick={() => {
            CLickLabel('modalProximaEtapaRelato')
          }}
        />

        <Button
          title="Sim"
          className="w-full m-auto bg-green-700 hover:bg-green-700/80 active:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
          iconLeft={<Check size={20} />}
          onClick={onProxiamEtapa}
        />
      </div>
    </Modal>
  )
}
