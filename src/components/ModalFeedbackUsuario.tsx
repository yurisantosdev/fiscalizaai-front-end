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

export default function ModalFeedbackUsuario() {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors }
  } = useForm<FeedbacksUsuariosType>({
    defaultValues: {
      fufeedback: ''
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

  return (
    <Modal
      name="Queremos ouvir você!"
      htmlFor="modalFeedbackUsuario"
      functioReset={() => {
        reset()
      }}
      descricao="Ajude-nos a melhorar ainda mais! Utilize o campo abaixo para enviar sugestões, relatar problemas ou compartilhar sua experiência com nosso sistema. Sua opinião é muito importante para nós."
      loading={loading}>
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
