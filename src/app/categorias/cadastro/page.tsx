'use client'
import React, { useEffect } from 'react'
import TextRequired from '@/components/TextRequired'
import BaseLayout from '@/templates/BaseLayout'
import {
  CaretLeft,
  ChatTeardropText,
  NavigationArrow,
  X,
  PencilSimple,
  Check
} from '@phosphor-icons/react'
import InputComponent from '@/components/Input'
import { useForm } from 'react-hook-form'
import Textarea from '@/components/Textarea'
import { Button, ButtonIcon } from '@/components/Button'
import { setLoading } from '@/redux/loading/actions'
import { useDispatch, useSelector } from 'react-redux'
import { CategoriasProblemasType } from '@/types/CategoriasProblemasType'
import { useRouter } from 'next/navigation'
import { resetCategoria } from '@/redux/categoria/actions'
import { atualizarCategoria, salvarCategoria } from '@/store/Categorias'
import toast from 'react-hot-toast'

export default function CadastroCategoria() {
  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors }
  } = useForm<CategoriasProblemasType>({
    defaultValues: {
      cacategoria: '',
      cadescricao: ''
    }
  })
  const dispatch = useDispatch()
  const router = useRouter()
  const categoriaSelecionada: CategoriasProblemasType = useSelector(
    (state: any) => state.categoriaReducer
  )

  useEffect(() => {
    if (categoriaSelecionada) {
      setValue('cacategoria', categoriaSelecionada.cacategoria)
      setValue('cadescricao', categoriaSelecionada.cadescricao)
      setValue('cacodigo', categoriaSelecionada.cacodigo)
      dispatch(setLoading(false))
    } else {
      dispatch(resetCategoria())
      dispatch(setLoading(false))
    }
  }, [categoriaSelecionada])

  async function onRegistrarCategoria(data: CategoriasProblemasType) {
    dispatch(setLoading(true))

    const response = data.cacodigo
      ? atualizarCategoria(data)
      : salvarCategoria(data)

    if (response != undefined) {
      toast.success(
        data.cacodigo
          ? 'Categoria atualizada com sucesso!'
          : 'Categoria cadastrada com sucesso!'
      )

      reset()
      window.dispatchEvent(new Event('categoriasAtualizar'))
      router.push('/categorias')
      router.refresh()
      dispatch(setLoading(false))
    }
  }

  function resetVoltarCategorias() {
    dispatch(setLoading(true))
    reset()
    router.push('/categorias')
  }

  return (
    <BaseLayout
      title={
        categoriaSelecionada.cacategoria.length > 0
          ? 'Atualizar Categoria'
          : 'Cadastro de Categoria'
      }
      extraComponentLeft={
        <ButtonIcon
          icon={<CaretLeft size={20} className="text-gray-400" />}
          className="bg-gray-200 hover:bg-gray-300 active:bg-gray-200 transform transition-all duration-300 hover:scale-105"
          onClick={resetVoltarCategorias}
        />
      }>
      <div className="max-w-2xl mx-auto">
        <div className="p-6 space-y-6">
          <InputComponent
            styleLabel="text-gray-600"
            id="cacategoria"
            type="text"
            requiredItem
            className={errors.cacategoria ? 'mb-4' : ''}
            placeholder="Informe um nome da categoria"
            icon={<NavigationArrow size={22} className="text-gray-500" />}
            textLabel="Nome da Categoria"
            {...register('cacategoria', { required: true })}
            textError={errors.cacategoria && <TextRequired />}
            error={errors.cacategoria}
          />

          <Textarea
            styleLabel="text-gray-600"
            id="cadescricao"
            requiredItem
            className={errors.cadescricao ? 'mb-2' : ''}
            placeholder="Informe uma descrição"
            icon={<ChatTeardropText size={22} className="text-gray-500" />}
            textLabel="Descrição"
            {...register('cadescricao', { required: true })}
            textError={errors.cadescricao && <TextRequired />}
            error={errors.cadescricao}
          />

          <div className="flex justify-center gap-4 pt-4">
            <Button
              title="Cancelar"
              className="bg-red-700 hover:bg-red-800 active:bg-red-700 text-white px-8 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 w-full flex items-center justify-center gap-2"
              onClick={resetVoltarCategorias}
              iconLeft={<X size={20} />}
            />

            <Button
              title={
                categoriaSelecionada.cacategoria.length > 0
                  ? 'Atualizar'
                  : 'Salvar'
              }
              onClick={handleSubmit(onRegistrarCategoria)}
              className="bg-green-700 hover:bg-green-800 active:bg-green-700 text-white px-8 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 w-full flex items-center justify-center gap-2"
              iconLeft={
                categoriaSelecionada.cacategoria.length > 0 ? (
                  <PencilSimple size={20} />
                ) : (
                  <Check size={20} />
                )
              }
            />
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}
