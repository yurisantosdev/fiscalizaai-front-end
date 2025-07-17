import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Check, X } from '@phosphor-icons/react'
import { CLickLabel } from '@/services/clickLabel'
import toast from 'react-hot-toast'
import Modal from '@/components/Modal'
import { Button } from '@/components/Button'
import { resetCategoria } from '@/redux/categoria/actions'
import { FeaturesConsultaType } from '@/types/FeaturesType'
import { deleteFeature } from '@/store/Features'

export default function ModalConfirmacaoDeletar() {
  const loading = useSelector((state: any) => state.loadingReducer.loading)
  const dispatch = useDispatch()
  const featureSelecioanda: FeaturesConsultaType = useSelector(
    (state: any) => state.featureReducer
  )

  async function onDeletarFeature() {
    const response = deleteFeature(featureSelecioanda.ftcodigo)

    if (response != undefined) {
      toast.success('Feature deletada com sucesso!')
      dispatch(resetCategoria())
      CLickLabel('modalConfirmarDeletarFeature')
      window.dispatchEvent(new Event('featuresAtualizar'))
    }
  }

  return (
    <Modal
      name="Atenção!"
      htmlFor="modalConfirmarDeletarFeature"
      loading={loading}>
      <p className="font-bold text-lg text-center text-black">
        Você tem certeza desta ação?
      </p>
      <p className="text-lg text-center font-extralight text-black">
        Ao deletar esta feature, ela não estará mais disponível!
      </p>

      <div className="flex justify-center items-center gap-3 mt-5">
        <Button
          title="Não"
          className="w-full m-auto bg-red-700 hover:bg-red-700/80 active:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
          iconLeft={<X size={20} />}
          onClick={() => {
            CLickLabel('modalConfirmarDeletarFeature')
          }}
        />

        <Button
          title="Sim"
          className="w-full m-auto bg-green-700 hover:bg-green-700/80 active:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
          iconLeft={<Check size={20} />}
          onClick={onDeletarFeature}
        />
      </div>
    </Modal>
  )
}
