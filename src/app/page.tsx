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
      adicionarItens={false}>
      <main className="min-h-screen flex flex-col justify-center items-center px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
          <div className="p-8 pt-4">
            <div className="text-center mb-8">
              <h1 className="text-2xl text-gray-800 font-bold mb-2">
                Bem-vindo ao FiscalizaAí
              </h1>
              <p className="text-gray-500">
                Entre com suas credenciais para acessar
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <InputComponent
                  id="email"
                  type="text"
                  placeholder="Informe seu E-mail"
                  className="w-full bg-gray-50 text-gray-900 transition-all duration-300 focus:ring-2 focus:ring-orange-1000/50 mb-5"
                  icon={<User size={22} className="text-gray-500" />}
                  textLabel="E-mail"
                  styleLabel="text-gray-700 font-medium"
                  {...register('email', { required: true })}
                  textError={errors.email && <TextRequired />}
                  error={errors.email}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSubmit(onLogin)()
                    }
                  }}
                />
              </div>

              <div>
                <InputComponent
                  id="senha"
                  type={typePassword}
                  className="w-full bg-gray-50 text-gray-900 transition-all duration-300 focus:ring-2 focus:ring-orange-1000/50 mb-5"
                  textLabel="Senha"
                  styleLabel="text-gray-700 font-medium"
                  placeholder="Informe sua senha"
                  icon={<Lock size={22} className="text-gray-500" />}
                  buttonRight={iconPassword}
                  onClickButton={() => {
                    if (typePassword == 'password') {
                      setTypePassword('text')
                      setIconPassword(
                        <Eye
                          className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                          size={30}
                        />
                      )
                    } else {
                      setTypePassword('password')
                      setIconPassword(
                        <EyeSlash
                          className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                          size={30}
                        />
                      )
                    }
                  }}
                  {...register('senha', { required: true })}
                  textError={errors.senha && <TextRequired />}
                  error={errors.senha}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSubmit(onLogin)()
                    }
                  }}
                />

                <p
                  className="text-sm text-gray-500 hover:text-orange-1000 transition-colors mt-2 cursor-pointer w-max select-none"
                  onClick={() => {
                    router.push('/esqueciSenha')
                  }}>
                  Esqueci minha senha
                </p>
              </div>

              <Button
                title="ENTRAR"
                className="w-full bg-orange-1000 hover:bg-orange-900 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg font-medium"
                onClick={handleSubmit(onLogin)}
              />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">ou</span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-gray-500 text-sm mb-2">
                  Não tem uma conta ainda?
                </p>
                <Button
                  title="Criar Nova Conta"
                  className="w-full bg-blue-1000 hover:bg-blue-900 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg font-medium"
                  onClick={() => {
                    router.push('cadastrar')
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </BaseApp>
  )
}
