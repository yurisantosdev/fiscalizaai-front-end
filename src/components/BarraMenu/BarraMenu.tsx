import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import iconeSemFundo from '../../../public/logoCentral.png'
import { logoutUser } from '@/redux/user/actions'
import { useDispatch, useSelector } from 'react-redux'
import {
  Bell,
  HouseSimple,
  List,
  ListBullets,
  ListMagnifyingGlass,
  SignOut,
  SquaresFour,
  UserCircle,
  ChartLine,
  ListChecks
} from '@phosphor-icons/react'
import { useRouter } from 'next/navigation'
import { setLoading } from '@/redux/loading/actions'
import { UsuarioConsultaType } from '@/types/UsuariosType'
import { CLickLabel } from '@/services/clickLabel'
import AbaNotificacoes from './Abanotificacoes'
import AbaPerfil from './AbaPerfil'
import { NotificacoesSimplesConsultaType } from '@/types/NotificacoesType'
import { atualizarNotificacoes } from '@/services/atualizarNotificacoes'

export default function BarraMenu() {
  const dispatch = useDispatch()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const user: UsuarioConsultaType = useSelector(
    (state: any) => state.userReducer
  )
  const notificacoes: NotificacoesSimplesConsultaType = useSelector(
    (state: any) => state.notificacoesReducer
  )

  useEffect(() => {
    const consultaDados = async () => {
      await atualizarNotificacoes()
    }

    consultaDados()
  }, [user])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleMenuItemClick = (action: () => void) => {
    setIsOpen(false)
    action()
  }

  return (
    <div>
      <div className="navbar bg-gray-1200 shadow-sm rounded-md">
        <div className="navbar-start">
          <div className="relative" ref={menuRef}>
            <div
              role="button"
              className="btn btn-ghost btn-circle"
              onClick={() => setIsOpen(!isOpen)}>
              <List
                size={30}
                className="text-white cursor-pointer rounded-full p-1 hover:bg-gray-100/30 active:scale-90 duration-200"
              />
            </div>

            {isOpen && (
              <ul className="absolute left-0 mt-2 menu menu-sm bg-base-100 rounded-box z-50 w-52 p-2 shadow">
                <li className="py-2">
                  <div
                    className="flex justify-between items-center"
                    onClick={() =>
                      handleMenuItemClick(() => router.push('/home'))
                    }>
                    <div>
                      <p className="text-md font-bold">Home</p>
                    </div>
                    <div>
                      <HouseSimple size={20} />
                    </div>
                  </div>
                </li>

                <li className="py-2">
                  <div
                    className="flex justify-between items-center"
                    onClick={() =>
                      handleMenuItemClick(() => CLickLabel('abaLateralPerfil'))
                    }>
                    <div>
                      <p className="text-md font-bold">Perfil</p>
                    </div>
                    <div>
                      <UserCircle size={20} />
                    </div>
                  </div>
                </li>

                <li className="py-2">
                  <div
                    className="flex justify-between items-center"
                    onClick={() =>
                      handleMenuItemClick(() => router.push('/meusRelatos'))
                    }>
                    <div>
                      <p className="text-md font-bold">Meus Relatos</p>
                    </div>
                    <div>
                      <ListBullets size={20} />
                    </div>
                  </div>
                </li>

                {user.usmaster ? (
                  <>
                    <li className="py-2">
                      <div
                        className="flex justify-between items-center"
                        onClick={() =>
                          handleMenuItemClick(() =>
                            router.push('/analisarRelatos')
                          )
                        }>
                        <div>
                          <p className="text-md font-bold">Analisar Relatos</p>
                        </div>
                        <div>
                          <ListMagnifyingGlass size={20} />
                        </div>
                      </div>
                    </li>

                    <li className="py-2">
                      <div
                        className="flex justify-between items-center"
                        onClick={() =>
                          handleMenuItemClick(() => router.push('/categorias'))
                        }>
                        <div>
                          <p className="text-md font-bold">Categorias</p>
                        </div>
                        <div>
                          <SquaresFour size={20} />
                        </div>
                      </div>
                    </li>

                    <li className="py-2">
                      <div
                        className="flex justify-between items-center"
                        onClick={() =>
                          handleMenuItemClick(() => router.push('/relatorio'))
                        }>
                        <div>
                          <p className="text-md font-bold">Relatório</p>
                        </div>
                        <div>
                          <ChartLine size={20} />
                        </div>
                      </div>
                    </li>

                    <li className="py-2">
                      <div
                        className="flex justify-between items-center"
                        onClick={() =>
                          handleMenuItemClick(() => router.push('/relatos'))
                        }>
                        <div>
                          <p className="text-md font-bold">Relatos</p>
                        </div>
                        <div>
                          <ListChecks size={20} />
                        </div>
                      </div>
                    </li>
                  </>
                ) : null}

                <li className="py-2">
                  <div
                    className="flex justify-between items-center"
                    onClick={() =>
                      handleMenuItemClick(() => {
                        dispatch(setLoading(true))
                        dispatch(logoutUser())
                      })
                    }>
                    <a className="text-md font-bold">Sair</a>
                    <SignOut size={20} />
                  </div>
                </li>
              </ul>
            )}
          </div>
        </div>

        <div
          className="navbar-center cursor-pointer"
          onClick={() => {
            router.push('/home')
          }}>
          <Image src={iconeSemFundo} className="w-[120px]" alt={''} />
        </div>

        <div className="navbar-end">
          <label className="relative" htmlFor="abaLateralNotificacoes">
            <Bell
              size={30}
              className="text-white cursor-pointer rounded-full p-1 hover:bg-gray-100/30 active:scale-90 duration-200"
            />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {notificacoes && notificacoes.naoLidas.length}
            </span>
          </label>
        </div>
      </div>

      <AbaNotificacoes />
      <AbaPerfil />
    </div>
  )
}
