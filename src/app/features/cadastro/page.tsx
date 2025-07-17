'use client'
import React, { useState } from 'react'
import TextRequired from '@/components/TextRequired'
import BaseLayout from '@/templates/BaseLayout'
import {
  CaretLeft,
  ChatTeardropText,
  X,
  Check,
  ImageSquare,
  Image,
  ChatCircleText,
  TextAa
} from '@phosphor-icons/react'
import InputComponent from '@/components/Input'
import { useForm } from 'react-hook-form'
import Textarea from '@/components/Textarea'
import { Button, ButtonIcon } from '@/components/Button'
import { setLoading } from '@/redux/loading/actions'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { FeaturesCreateType } from '@/types/FeaturesType'
import toast from 'react-hot-toast'
import { UsuarioConsultaType } from '@/types/UsuariosType'
import { createFeature } from '@/store/Features'

export default function CadastroFeature() {
  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors }
  } = useForm<FeaturesCreateType>({
    defaultValues: {
      fttitulo: '',
      ftdescricao: '',
      ftusuario: '',
      fotos: []
    }
  })
  const dispatch = useDispatch()
  const router = useRouter()
  const [fotos, setFotos] = useState<{ fffoto: string; ffdescricao: string }[]>(
    []
  )
  const user: UsuarioConsultaType = useSelector(
    (state: any) => state.userReducer
  )

  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  function handleRemoverFoto(idx: number) {
    setFotos((prev) => prev.filter((_, i) => i !== idx))
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files
    if (files) {
      const newFotos: { fffoto: string; ffdescricao: string }[] = []
      let loaded = 0
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            newFotos.push({
              fffoto: e.target.result.toString().split(',')[1],
              ffdescricao: ''
            })
            loaded++
            if (loaded === files.length) {
              setFotos([...fotos, ...newFotos])
            }
          }
        }
        reader.readAsDataURL(files[i])
      }
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave() {
    setIsDragging(false)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files) {
      const newFotos: { fffoto: string; ffdescricao: string }[] = []
      let loaded = 0
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            newFotos.push({
              fffoto: e.target.result.toString().split(',')[1],
              ffdescricao: ''
            })
            loaded++
            if (loaded === files.length) {
              setFotos([...fotos, ...newFotos])
            }
          }
        }
        reader.readAsDataURL(files[i])
      }
    }
  }

  function handleDescricaoChange(idx: number, value: string) {
    setFotos((prev) =>
      prev.map((foto, i) =>
        i === idx ? { ...foto, ffdescricao: value } : foto
      )
    )
  }

  async function onRegistrarFeature(data: FeaturesCreateType) {
    dispatch(setLoading(true))
    data.ftusuario = user.uscodigo
    data.fotos = fotos

    const response = await createFeature(data)

    if (response != undefined) {
      toast.success('Feature cadastrada com sucesso!')
      router.push('/features')
      setFotos([])
      reset()
      router.refresh()
      window.dispatchEvent(new Event('featuresAtualizar'))
    }
    dispatch(setLoading(false))
  }

  function resetVoltarFeatures() {
    dispatch(setLoading(true))
    reset()
    setFotos([])
    router.push('/features')
  }

  return (
    <BaseLayout
      title={'Cadastro de Feature'}
      extraComponentLeft={
        <ButtonIcon
          icon={<CaretLeft size={20} className="text-gray-400" />}
          className="bg-gray-200 hover:bg-gray-300 active:bg-gray-200 transform transition-all duration-300 hover:scale-105"
          onClick={resetVoltarFeatures}
        />
      }>
      <div className="max-w-2xl mx-auto">
        <div className="p-6 space-y-6">
          <InputComponent
            styleLabel="text-gray-600"
            id="fttitulo"
            type="text"
            requiredItem
            className={errors.fttitulo ? 'mb-4' : ''}
            placeholder="Informe o título da feature"
            icon={<TextAa size={22} className="text-gray-500" />}
            textLabel="Título da Feature"
            {...register('fttitulo', { required: true })}
            textError={errors.fttitulo && <TextRequired />}
            error={errors.fttitulo}
          />

          <Textarea
            styleLabel="text-gray-600"
            id="ftdescricao"
            requiredItem
            className={errors.ftdescricao ? 'mb-2' : ''}
            placeholder="Informe uma descrição"
            icon={<ChatTeardropText size={22} className="text-gray-500" />}
            textLabel="Descrição"
            {...register('ftdescricao', { required: true })}
            textError={errors.ftdescricao && <TextRequired />}
            error={errors.ftdescricao}
          />

          <div>
            <label
              className="text-gray-600 font-medium mb-1 flex items-center gap-2"
              htmlFor="fotos">
              <ImageSquare size={22} className="text-gray-500" /> Fotos da
              Feature
            </label>
            <div
              className={`flex gap-2 mb-2 ${isDragging ? 'bg-blue-50' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}>
              <Button
                title="Anexar"
                onClick={() => fileInputRef.current?.click()}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-300 w-full active:bg-gray-200"
                iconLeft={<Image size={20} />}
              />
            </div>
            <input
              id="fotos"
              type="file"
              multiple
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            {fotos.length > 0 && (
              <div className="mt-2 flex flex-col gap-4 pb-2">
                {fotos.map((foto, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center relative bg-white border rounded p-2 shadow-sm w-full mx-auto">
                    <img
                      src={`data:image/jpeg;base64,${foto.fffoto}`}
                      alt={`Foto ${idx + 1}`}
                      className="w-32 h-32 object-cover rounded mb-2"
                    />
                    <div className="w-full">
                      <InputComponent
                        styleLabel="text-gray-600"
                        id={`ffdescricao-${idx}`}
                        type="text"
                        value={foto.ffdescricao}
                        onChange={(e) =>
                          handleDescricaoChange(idx, e.target.value)
                        }
                        placeholder="Informe a descrição da imagem"
                        icon={
                          <ChatCircleText size={22} className="text-gray-500" />
                        }
                      />
                    </div>

                    <button
                      onClick={() => handleRemoverFoto(idx)}
                      className="absolute top-1 text-red-600 hover:bg-red-100 rounded-full p-1 cursor-pointer right-1">
                      <X size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <Button
              title="Cancelar"
              className="bg-red-700 hover:bg-red-800 active:bg-red-700 text-white px-8 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 w-full flex items-center justify-center gap-2"
              onClick={resetVoltarFeatures}
              iconLeft={<X size={20} />}
            />

            <Button
              title={'Salvar'}
              onClick={handleSubmit(onRegistrarFeature)}
              className="bg-green-700 hover:bg-green-800 active:bg-green-700 text-white px-8 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 w-full flex items-center justify-center gap-2"
              iconLeft={<Check size={20} />}
            />
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}
