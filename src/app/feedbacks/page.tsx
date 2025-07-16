'use client'
import React, { useEffect, useState } from 'react'
import BaseLayout from '@/templates/BaseLayout'
import { FeedbacksUsuariosType } from '@/types/FeedbacksUsuariosType'
import { findAllFeedbacks, lerFeedback } from '@/store/Feedbacks'
import { useDispatch } from 'react-redux'
import { setLoading } from '@/redux/loading/actions'
import {
  ArrowClockwise,
  SealQuestion,
  CheckCircle,
  XCircle,
  ListChecks,
  Star
} from '@phosphor-icons/react'
import toast from 'react-hot-toast'
import { AuthUser } from '@/services/auth'

export default function Feedbacks() {
  AuthUser()
  const [feedbacks, setFeedbacks] = useState<Array<FeedbacksUsuariosType>>()
  const [atualizar, setAtualizar] = useState<number>(0)
  const [filtro, setFiltro] = useState<'todos' | 'lidos' | 'naoLidos'>('todos')
  const dispatch = useDispatch()

  const filtroOptions = [
    {
      value: 'todos',
      label: 'Todos',
      color: 'bg-gray-100 text-gray-800',
      icon: <ListChecks size={20} />
    },
    {
      value: 'lidos',
      label: 'Lidos',
      color: 'bg-green-100 text-green-800',
      icon: <CheckCircle size={20} />
    },
    {
      value: 'naoLidos',
      label: 'Não lidos',
      color: 'bg-blue-100 text-blue-800',
      icon: <XCircle size={20} />
    }
  ]

  useEffect(() => {
    const consultaFeedbacks = async () => {
      dispatch(setLoading(true))
      const response = await findAllFeedbacks()

      if (response != undefined) {
        setFeedbacks(response.feedbacks)
      }

      dispatch(setLoading(false))
    }

    consultaFeedbacks()
  }, [atualizar])

  async function onLerFeedback(feedback: FeedbacksUsuariosType) {
    if (feedback.fucodigo) {
      dispatch(setLoading(true))
      const response = await lerFeedback({ fucodigo: feedback.fucodigo })

      if (response != undefined) {
        setAtualizar(atualizar + 1)
        toast.success('Feedback lido com sucesso!')
      }

      dispatch(setLoading(false))
    }
  }

  return (
    <BaseLayout kauaneAi={false} title="Feedbacks">
      {/* Indicadores de feedbacks */}
      <div className="flex justify-center my-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl w-full">
          <div className="bg-gray-100 rounded-xl p-4 flex flex-col items-center shadow hover:shadow-lg transition-all">
            <span className="text-4xl font-bold text-gray-800">
              {feedbacks ? feedbacks.length : 0}
            </span>
            <span className="text-sm text-gray-500 truncate flex items-center gap-1 mt-1">
              <ListChecks size={18} /> Total de feedbacks
            </span>
          </div>
          <div className="bg-blue-100 rounded-xl p-4 flex flex-col items-center shadow hover:shadow-lg transition-all">
            <span className="text-4xl font-bold text-blue-800">
              {feedbacks ? feedbacks.filter((f) => !f.fulido).length : 0}
            </span>
            <span className="text-sm text-blue-800 truncate flex items-center gap-1 mt-1">
              <XCircle size={18} /> Não lidos
            </span>
          </div>
          <div className="bg-green-100 rounded-xl p-4 flex flex-col items-center shadow hover:shadow-lg transition-all">
            <span className="text-4xl font-bold text-green-800">
              {feedbacks ? feedbacks.filter((f) => f.fulido).length : 0}
            </span>
            <span className="text-sm text-green-800 truncate flex items-center gap-1 mt-1">
              <CheckCircle size={18} /> Lidos
            </span>
          </div>
        </div>
      </div>

      {/* Botão atualizar */}
      <div className="flex justify-end mb-4">
        <div
          className="text-center w-[50%] m-auto bg-blue-1000 rounded-md p-2 hover:bg-blue-800 active:bg-blue-900 duration-300 cursor-pointer flex justify-center items-center gap-2"
          onClick={() => {
            setAtualizar(atualizar + 1)
          }}>
          <ArrowClockwise size={20} />
          <p className="text-white">Atualizar</p>
        </div>
      </div>

      {/* Painel de filtros */}
      <div className="flex flex-wrap gap-2 mb-4 items-center justify-center">
        {filtroOptions.map((option, idx) => (
          <button
            key={idx}
            onClick={() => setFiltro(option.value as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-md border cursor-pointer border-gray-200 ${
              option.color
            } ${
              filtro === option.value
                ? 'ring-2 ring-blue-700 ring-offset-2'
                : ''
            }`}>
            {option.icon}
            {option.label}
          </button>
        ))}
      </div>

      {feedbacks && feedbacks.length > 0 ? (
        <div className="animate-slide-up">
          {feedbacks
            ?.filter((feedback) => {
              if (filtro === 'lidos') return feedback.fulido
              if (filtro === 'naoLidos') return !feedback.fulido
              return true
            })
            .map((feedback: FeedbacksUsuariosType, index: number) => {
              return (
                <div
                  key={index}
                  className={`${
                    feedback.fulido ? 'bg-gray-100' : 'bg-blue-100'
                  } shadow p-2 rounded-md mt-3 flex justify-start items-center gap-3`}>
                  <div>
                    <SealQuestion size={40} className="text-black" />
                  </div>
                  <div>
                    <p className="text-black font-medium text-md">
                      {feedback.fufeedback}
                    </p>
                    {/* Estrelas de avaliação */}
                    <div className="flex items-center gap-0.5 mt-1 mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={18}
                          weight={
                            feedback.fuestrelas && feedback.fuestrelas >= star
                              ? 'fill'
                              : 'regular'
                          }
                          className={
                            feedback.fuestrelas && feedback.fuestrelas >= star
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }
                        />
                      ))}
                    </div>
                    <p className="text-black text-md font-extralight mt-1">
                      {feedback.fuquando}
                    </p>
                    <p
                      className={`text-xs mt-1 font-bold ${
                        feedback.fulido ? 'text-green-600' : 'text-red-600'
                      }`}>
                      {feedback.fulido ? 'LIDO' : 'NÃO LIDO'}
                    </p>
                    {!feedback.fulido && (
                      <button
                        className="cursor-pointer mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all text-xs font-semibold"
                        onClick={() => onLerFeedback(feedback)}>
                        Marcar como lido
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
        </div>
      ) : (
        <p>Nenhum feedback registrado</p>
      )}

      <style jsx global>{`
        .animate-slide-up {
          animation: slideUp 0.7s cubic-bezier(0.4, 2, 0.6, 1);
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </BaseLayout>
  )
}
