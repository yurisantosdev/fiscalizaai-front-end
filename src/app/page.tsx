'use client'
import InputComponent from '@/components/Input'
import React, { ReactNode, useState, useEffect } from 'react'
import { User, Lock, Eye, EyeSlash } from '@phosphor-icons/react'
import { Button } from '@/components/Button'
import { useForm } from 'react-hook-form'
import { LoginType } from '@/types/LoginType'
import TextRequired from '@/components/TextRequired'
import { loginFuncion } from '@/store/Login'
import BaseApp from '@/components/BaseApp'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, logoutUser } from '@/redux/user/actions'
import { useRouter } from 'next/navigation'
import { AuthUser } from '@/services/auth'
import { setLoading } from '@/redux/loading/actions'
import Image from 'next/image'
import logomarca from '../../public/logo.png'

export default function Home() {
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<LoginType>({
    defaultValues: {
      email: '',
      senha: ''
    }
  })
  const loading = useSelector((state: any) => state.loadingReducer.loading)
  const dispatch = useDispatch()
  const router = useRouter()
  const [typePassword, setTypePassword] = useState<'text' | 'password'>(
    'password'
  )
  const [iconPassword, setIconPassword] = useState<ReactNode>(
    <EyeSlash className="p-1" size={30} />
  )

  AuthUser()

  useEffect(() => {
    dispatch(setLoading(false))
  }, [])

  /**
   * Realiza o login do usuário.
   * - Obtém os dados do formulário.
   * - Realiza o login.
   * - Redireciona para a página de home.
   *
   * @autor Yuri 🇧🇷
   */
  async function onLogin(data: LoginType) {
    dispatch(setLoading(true))

    try {
      const response = await loginFuncion(data)

      if (response != undefined) {
        const objUsuario = response.user
        objUsuario.token = response.access_token

        dispatch(loginUser(objUsuario))
        router.push('/home')
      }
    } catch (error) {
      dispatch(logoutUser())
    } finally {
      dispatch(setLoading(false))
    }
  }

  return (
    <BaseApp
      loading={loading}
      styleBase={false}
      menu={false}
      adicionarItens={false}
    >
      <main className="flex justify-center items-end lg:items-center">
        <Image
          src={logomarca}
          alt={''}
          className="absolute top-1 md:w-52 md:h-52 w-60 h-60 z-10"
        />
        <div className="bg-gray-1000 md:py-4 md:mt-16 md:p-0 p-3 rounded-md w-[90%] lg:w-[34%] md:mb-0 mb-24  z-20">
          <div className="md:mb-4 mb-3">
            <h1 className="md:text-[21px] text-lg text-white font-bold text-center select-none">
              Acessar
            </h1>
          </div>

          <div className="md:w-[80%] md:m-auto">
            <InputComponent
              id="email"
              type="text"
              placeholder="Informe seu E-mail"
              className="mb-5"
              icon={<User size={22} />}
              textLabel="E-mail"
              {...register('email', { required: true })}
              textError={errors.email && <TextRequired />}
              error={errors.email}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleSubmit(onLogin)()
                }
              }}
            />
          </div>

          <div className="md:w-[80%] md:m-auto pb-6">
            <InputComponent
              id="senha"
              type={typePassword}
              className="mb-5"
              textLabel="Senha"
              placeholder="Informe sua senha"
              icon={<Lock size={22} />}
              buttonRight={iconPassword}
              onClickButton={() => {
                if (typePassword == 'password') {
                  setTypePassword('text')
                  setIconPassword(<Eye className="p-1" size={30} />)
                } else {
                  setTypePassword('password')
                  setIconPassword(<EyeSlash className="p-1" size={30} />)
                }
              }}
              {...register('senha', { required: true })}
              textError={errors.senha && <TextRequired />}
              error={errors.senha}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleSubmit(onLogin)()
                }
              }}
            />

            <p
              className="text-sm text-gray-1400 hover:underline cursor-pointer w-max select-none"
              onClick={() => {
                router.push('/esqueciSenha')
              }}
            >
              Esqueci senha
            </p>
          </div>

          <div className="md:w-[80%] md:m-auto">
            <Button
              title="ENTRAR"
              className="w-full bg-orange-1000 active:bg-orange-1000/70 hover:bg-orange-1000/60"
              onClick={handleSubmit(onLogin)}
            />
          </div>

          <div className="md:w-[80%] md:m-auto md:mt-9 mt-8">
            <p className="text-white text-sm text-center mb-2">
              Não tem cadastro ainda?
            </p>

            <Button
              title="Cadastrar-se"
              className="w-full bg-blue-1000 active:bg-blue-1000/70 hover:bg-blue-1000/60"
              onClick={() => {
                router.push('cadastrar')
              }}
            />
          </div>
        </div>
      </main>
    </BaseApp>
  )
}
