import { UsuarioConsultaType } from '@/types/UsuariosType'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
  NotificacoesSimplesConsultaType,
  NotificacoesType
} from '@/types/NotificacoesType'
import { X, Bell, CheckCircle } from '@phosphor-icons/react'
import { FormatarData } from '@/services/formatters'
import { letTodasNotificacoes } from '@/store/Notificacoes'
import toast from 'react-hot-toast'
import { CLickLabel } from '@/services/clickLabel'
import { atualizarNotificacoes } from '@/services/atualizarNotificacoes'
import { useRouter } from 'next/navigation'

export default function AbaNotificacoes() {
  const user: UsuarioConsultaType = useSelector(
    (state: any) => state.userReducer
  )
  const notificacoes: NotificacoesSimplesConsultaType = useSelector(
    (state: any) => state.notificacoesReducer
  )
  const router = useRouter()

  async function onLerNotificacoes() {
    if (user.uscodigo) {
      const response = await letTodasNotificacoes({ uscodigo: user.uscodigo })

      if (response != undefined) {
        toast.success('Todas as notificações lidas com sucesso!')
        CLickLabel('abaLateralNotificacoes')
        await atualizarNotificacoes()
      }
    }
  }

  useEffect(() => {
    const consultaDados = async () => {
      await atualizarNotificacoes()
    }

    consultaDados()
  }, [user])

  return (
    <div className="drawer drawer-end">
      <input
        id="abaLateralNotificacoes"
        type="checkbox"
        className="drawer-toggle"
      />

      <div className="drawer-side z-[9999999]">
        <label
          htmlFor="abaLateralNotificacoes"
          aria-label="close sidebar"
          className="drawer-overlay"></label>
        <div className="bg-white dark:bg-gray-1200 p-0 h-screen rounded-l-2xl shadow-2xl md:w-[400px] w-[90vw] flex flex-col">
          {/* Cabeçalho */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-900 shadow-sm sticky top-0 bg-white dark:bg-gray-1200 z-10">
            <div className="flex items-center gap-2">
              <Bell size={24} className="text-blue-600" />
              <h1 className="text-gray-900 dark:text-white text-lg font-bold">
                Notificações
              </h1>
            </div>
            <label
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 p-2 rounded-full text-gray-400 hover:text-red-600 transition"
              htmlFor="abaLateralNotificacoes">
              <X size={20} />
            </label>
          </div>

          {/* Lista de notificações */}
          <div className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar bg-gray-50 dark:bg-gray-1100">
            {notificacoes && notificacoes.todas.length > 0 ? (
              notificacoes.todas.map(
                (notificacao: NotificacoesType, index: number) => (
                  <div
                    key={index}
                    onClick={() => {
                      if (notificacao.ntlink != null) {
                        router.push(notificacao.ntlink)
                      }
                    }}
                    className={`cursor-pointer mb-4 rounded-xl shadow-sm p-4 flex items-start gap-3 transition-all duration-200 bg-white dark:bg-gray-1200 border border-gray-100 dark:border-gray-900 ${
                      !notificacao.ntlida ? 'ring-2 ring-blue-500/30' : ''
                    }`}>
                    <div className="pt-1">
                      {!notificacao.ntlida ? (
                        <span className="inline-block w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>
                      ) : (
                        <CheckCircle size={18} className="text-green-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-gray-900 dark:text-white font-medium text-base mb-1">
                        {notificacao.ntnotificacao}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-light">
                        {FormatarData(notificacao.createdAt)}
                      </div>
                    </div>
                  </div>
                )
              )
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-16">
                <Bell size={48} className="text-gray-300 mb-2" />
                <p className="text-gray-400 text-lg font-semibold">
                  Nenhuma notificação encontrada
                </p>
              </div>
            )}
          </div>

          {/* Botão ler todas */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-900 bg-white dark:bg-gray-1200 sticky bottom-0 z-10">
            <button
              onClick={onLerNotificacoes}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition-all duration-200 active:scale-95 cursor-pointer">
              <CheckCircle size={20} />
              Marcar todas como lidas
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
