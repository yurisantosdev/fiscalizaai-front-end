import React, { useState } from 'react'
import Modal from './Modal'
import { useDispatch, useSelector } from 'react-redux'
import Input from './Input'
import { Button } from './Button'
import { Check, X, Eye, EyeSlash, Warning } from '@phosphor-icons/react'
import { CLickLabel } from '@/services/clickLabel'
import { TrocaSenhaType } from '@/types/TrocaSenhaType'
import { useForm } from 'react-hook-form'
import TextRequired from './TextRequired'
import { useRouter } from 'next/navigation'
import { UsuarioConsultaType } from '@/types/UsuariosType'
import { trocarSenha } from '@/store/Usuario'
import toast from 'react-hot-toast'
import { setLoading } from '@/redux/loading/actions'
import { logoutUser } from '@/redux/user/actions'

export default function ModalTrocaSenha() {
  const {
    handleSubmit,
    register,
    reset,
    watch,
    setError,
    formState: { errors }
  } = useForm<TrocaSenhaType>({
    defaultValues: {
      confirmarSenha: '',
      senhaAntiga: '',
      novaSenha: '',
      uscodigo: ''
    }
  })
  const loading = useSelector((state: any) => state.loadingReducer.loading)
  const dispatch = useDispatch()
  const router = useRouter()
  const user: UsuarioConsultaType = useSelector(
    (state: any) => state.userReducer
  )
  const [showSenhaAtual, setShowSenhaAtual] = useState(false)
  const [showNovaSenha, setShowNovaSenha] = useState(false)
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false)
  const novaSenhaValue = watch('novaSenha')
  const [menssageErro, setMenssageErro] = useState<string>('')

  async function onTrocarSenha(data: TrocaSenhaType) {
    dispatch(setLoading(true))
    setMenssageErro('')

    if (data.novaSenha !== data.confirmarSenha) {
      dispatch(setLoading(false))
      setMenssageErro('')

      setError('confirmarSenha', {
        type: 'validate',
        message: 'As senhas não coincidem.'
      })
    }
    data.uscodigo = user.uscodigo
    const response = await trocarSenha(data)

    if (response.status) {
      CLickLabel('modalTrocarSenha')
      toast.success('Senha alterada com sucesso!')
      dispatch(setLoading(true))
      dispatch(logoutUser())
    } else {
      dispatch(setLoading(false))
      setMenssageErro(response.error.error)
    }
  }

  return (
    <Modal
      name="Troca de senha"
      htmlFor="modalTrocarSenha"
      loading={loading}
      functioReset={() => {
        setMenssageErro('')
        reset()
      }}>
      <div>
        {menssageErro.length > 0 && (
          <div className="transition-all animate-slide-up bg-gradient-to-r from-red-700 to-red-600 p-3 rounded-xl md:w-[80%] w-full m-auto mb-5">
            <div className="flex justify-center items-center gap-2 mb-2">
              <h1 className="text-lg text-white text-center font-bold">
                Atenção
              </h1>
              <Warning size={20} className="text-white" />
            </div>

            <p className="text-md text-center text-white font-light text-xl">
              {menssageErro}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Input
            type={showSenhaAtual ? 'text' : 'password'}
            textLabel="Senha atual"
            placeholder="Digite sua senha atual"
            styleLabel="text-black"
            className="mb-4"
            {...register('senhaAntiga', { required: true })}
            textError={errors.senhaAntiga && <TextRequired />}
            error={errors.senhaAntiga}
            buttonRight={
              showSenhaAtual ? (
                <Eye size={22} className="text-gray-500" />
              ) : (
                <EyeSlash size={22} className="text-gray-500" />
              )
            }
            onClickButton={() => setShowSenhaAtual((v) => !v)}
          />
          <Input
            type={showNovaSenha ? 'text' : 'password'}
            textLabel="Nova senha"
            styleLabel="text-black"
            className="mb-4"
            placeholder="Digite a nova senha"
            {...register('novaSenha', { required: true })}
            textError={errors.novaSenha && <TextRequired />}
            error={errors.novaSenha}
            buttonRight={
              showNovaSenha ? (
                <Eye size={22} className="text-gray-500" />
              ) : (
                <EyeSlash size={22} className="text-gray-500" />
              )
            }
            onClickButton={() => setShowNovaSenha((v) => !v)}
          />
          <Input
            type={showConfirmarSenha ? 'text' : 'password'}
            textLabel="Confirmar nova senha"
            styleLabel="text-black"
            className="mb-4"
            placeholder="Confirme a nova senha"
            {...register('confirmarSenha', {
              required: true,
              validate: (value) =>
                value === novaSenhaValue || 'As senhas não coincidem.'
            })}
            textError={
              errors.confirmarSenha ? (
                errors.confirmarSenha.type === 'validate' ? (
                  <TextRequired message={errors.confirmarSenha.message} />
                ) : (
                  <TextRequired />
                )
              ) : undefined
            }
            error={errors.confirmarSenha}
            buttonRight={
              showConfirmarSenha ? (
                <Eye size={22} className="text-gray-500" />
              ) : (
                <EyeSlash size={22} className="text-gray-500" />
              )
            }
            onClickButton={() => setShowConfirmarSenha((v) => !v)}
          />

          <div className="flex justify-center items-center gap-3 mt-5">
            <Button
              title="Cancelar"
              className="w-full m-auto bg-red-700 hover:bg-red-700/80 active:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
              iconLeft={<X size={20} />}
              onClick={() => {
                reset()
                setMenssageErro('')
                CLickLabel('modalTrocarSenha')
              }}
            />

            <Button
              title="Salvar"
              className="w-full m-auto bg-green-700 hover:bg-green-700/80 active:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
              iconLeft={<Check size={20} />}
              onClick={handleSubmit(onTrocarSenha)}
            />
          </div>

          <p className="text-xs text-gray-500 text-center mt-4 flex justify-center items-center gap-2">
            Esqueceu sua senha? Clique aqui
            <span
              onClick={() => {
                reset()
                router.push('/esqueciSenha')
              }}
              className="font-bold hover:underline cursor-pointer">
              Redefinir senha
            </span>
          </p>
        </div>
      </div>
    </Modal>
  )
}
