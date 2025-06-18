import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Check, X } from '@phosphor-icons/react'
import { CLickLabel } from '@/services/clickLabel'
import toast from 'react-hot-toast'
import Modal from '@/components/Modal'
import { Button } from '@/components/Button'
import { CategoriasProblemasType } from '@/types/CategoriasProblemasType'
import { desativarAtivarCategoria } from '@/store/Categorias'
import { resetCategoria } from '@/redux/categoria/actions'

export default function ModalConfirmacaoDesativarCategoria() {
  const loading = useSelector((state: any) => state.loadingReducer.loading)
  const dispatch = useDispatch()
  const categoriaSelecionada: CategoriasProblemasType = useSelector(
    (state: any) => state.categoriaReducer
  )

  async function onDesativarCategoria() {
    const response = desativarAtivarCategoria(categoriaSelecionada)

    if (response != undefined) {
      toast.success(
        categoriaSelecionada.caativa 
          ? 'Categoria desativada com sucesso!' 
          : 'Categoria ativada com sucesso!'
      )
      dispatch(resetCategoria())
      CLickLabel('modalConfirmarDesativarCategoria')
      window.dispatchEvent(new Event('categoriasAtualizar'))
    }
  }

  return (
    <Modal
      name="Atenção!"
      htmlFor="modalConfirmarDesativarCategoria"
      loading={loading}>
      <p className="font-bold text-lg text-center text-black">
        Você tem certeza desta ação?
      </p>
      <p className="text-lg text-center font-extralight text-black">
        {categoriaSelecionada.caativa 
          ? 'Ao desativar esta categoria, ela não estará mais disponível para seleção em novos relatos.'
          : 'Ao ativar esta categoria, ela estará novamente disponível para seleção em novos relatos.'}
      </p>

      <div className="flex justify-center items-center gap-3 mt-5">
        <Button
          title="Não"
          className="w-full m-auto bg-red-700 hover:bg-red-700/80 active:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
          iconLeft={<X size={20} />}
          onClick={() => {
            CLickLabel('modalConfirmarDesativarCategoria')
          }}
        />

        <Button
          title="Sim"
          className="w-full m-auto bg-green-700 hover:bg-green-700/80 active:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
          iconLeft={<Check size={20} />}
          onClick={onDesativarCategoria}
        />
      </div>
    </Modal>
  )
}
