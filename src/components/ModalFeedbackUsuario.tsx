import React from 'react'
import Modal from './Modal'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from './Button'
import { Check, ChatCircleText, X } from '@phosphor-icons/react'
import { CLickLabel } from '@/services/clickLabel'
import toast from 'react-hot-toast'
import { setLoading } from '@/redux/loading/actions'
import InputComponent from './Input'
import TextRequired from './TextRequired'
import { FeedbacksUsuariosType } from '@/types/FeedbacksUsuariosType'
import { useForm } from 'react-hook-form'
import { salvarFeedback } from '@/store/Feedbacks'
import Textarea from './Textarea'
import { Star } from '@phosphor-icons/react'

export default function ModalFeedbackUsuario() {
  const {
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FeedbacksUsuariosType>({
    defaultValues: {
      fufeedback: '',
      fuestrelas: 0
    }
  })
  const loading = useSelector((state: any) => state.loadingReducer.loading)
  const dispatch = useDispatch()

  async function onSalvarFeedback(data: FeedbacksUsuariosType) {
    dispatch(setLoading(true))

    const response = await salvarFeedback(data)
    if (response != undefined) {
      toast.success('Feedback cadastrado com sucesso!')
      CLickLabel('modalFeedbackUsuario')
      reset()
      dispatch(setLoading(false))
    } else {
      dispatch(setLoading(false))
    }
  }

  // Controle das estrelas
  const estrelas = watch('fuestrelas') || 0
  const handleSetEstrelas = (valor: number) => {
    setValue('fuestrelas', valor)
  }

  return (
    <Modal
      name="Queremos ouvir você!"
      htmlFor="modalFeedbackUsuario"
      functioReset={() => {
        reset()
      }}
      descricao="Ajude-nos a melhorar ainda mais! Utilize o campo abaixo para enviar sugestões, relatar problemas ou compartilhar sua experiência com nosso sistema. Sua opinião é muito importante para nós."
      loading={loading}>
      {/* Campo de estrelas */}
      <div className="flex flex-col items-start mb-4">
        <label className="text-gray-600 font-medium mb-1">Avaliação</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => handleSetEstrelas(star)}
              className="focus:outline-none">
              <Star
                size={28}
                weight={estrelas >= star ? 'fill' : 'regular'}
                className={
                  (estrelas >= star ? 'text-yellow-400' : 'text-gray-300') +
                  ' cursor-pointer'
                }
              />
            </button>
          ))}
          {/* Botão para zerar estrelas */}
          <button
            type="button"
            onClick={() => handleSetEstrelas(0)}
            className="ml-2 text-xs text-gray-500 underline">
            Limpar
          </button>
        </div>
        {errors.fuestrelas && (
          <span className="text-xs text-red-600 mt-1">
            Selecione uma quantidade de estrelas
          </span>
        )}
      </div>

      <Textarea
        styleLabel="text-gray-600"
        id="fufeedback"
        requiredItem
        className={errors.fufeedback ? 'mb-4' : ''}
        placeholder="Informe seu feedback"
        rows={40}
        icon={<ChatCircleText size={22} className="text-gray-500" />}
        textLabel="Feedback"
        {...register('fufeedback', { required: true })}
        textError={errors.fufeedback && <TextRequired />}
        error={errors.fufeedback}
      />

      <div className="flex justify-center items-center gap-3 mt-5">
        <Button
          title="Cancelar"
          className="w-full m-auto bg-red-700 hover:bg-red-700/80 active:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
          iconLeft={<X size={20} />}
          onClick={() => {
            reset()
            CLickLabel('modalFeedbackUsuario')
          }}
        />

        <Button
          title="Salvar"
          className="w-full m-auto bg-green-700 hover:bg-green-700/80 active:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
          iconLeft={<Check size={20} />}
          onClick={handleSubmit(onSalvarFeedback)}
        />
      </div>
    </Modal>
  )
}
