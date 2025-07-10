'use client'
import React, { useState, useRef, useEffect } from 'react'
import BaseLayout from '@/templates/BaseLayout'
import { enviarMensagemKauane } from '@/services/kauane'
import {
  UserCircle,
  Brain,
  PaperPlaneTilt,
  ChatsCircle,
  ArrowCounterClockwise
} from '@phosphor-icons/react'
import InputComponent from '@/components/Input'

interface Mensagem {
  autor: 'user' | 'gpt'
  texto: string
}

export default function KauaneAi() {
  const [mensagem, setMensagem] = useState('')
  const [historico, setHistorico] = useState<Mensagem[]>([])
  const [carregando, setCarregando] = useState(false)
  const [mensagensAjuda, setMensagensAjuda] = useState<Array<string>>([
    'Quais são os principais problemas relatados na minha cidade?',
    'Onde há mais buracos nas ruas da cidade?',
    'Quais bairros têm mais reclamações sobre iluminação pública?',
    'Quantos relatos de lixo acumulado foram registrados este mês?'
  ])
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [historico])

  async function enviarMensagem() {
    if (!mensagem.trim()) {
      return
    }

    const msg = mensagem
    setHistorico((h) => [...h, { autor: 'user', texto: msg }])
    setMensagem('')
    setCarregando(true)
    try {
      const data = await enviarMensagemKauane(msg, [
        ...historico,
        { autor: 'user', texto: msg }
      ])
      setHistorico((h) => [...h, { autor: 'gpt', texto: data.message }])
    } catch (err) {
      setHistorico((h) => [
        ...h,
        {
          autor: 'gpt',
          texto: 'Erro ao obter resposta. Por favor tente novamente!'
        }
      ])
    }
    setCarregando(false)
  }

  async function enviarMensagemDefinida(message: string) {
    setMensagem('')
    setCarregando(true)
    setHistorico((h) => [...h, { autor: 'user', texto: message }])
    try {
      const data = await enviarMensagemKauane(message, [
        ...historico,
        { autor: 'user', texto: message }
      ])
      setHistorico((h) => [...h, { autor: 'gpt', texto: data.message }])
    } catch (err) {
      setHistorico((h) => [
        ...h,
        {
          autor: 'gpt',
          texto: 'Erro ao obter resposta. Por favor tente novamente!'
        }
      ])
    }
    setCarregando(false)
  }

  return (
    <BaseLayout adicionarItens={false}>
      <div className="flex flex-col h-[80vh]">
        {historico.length > 0 && (
          <div className="flex justify-end mb-2">
            <button
              onClick={() => {
                setHistorico([])
                setMensagem('')
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-1000 to-orange-600 text-white px-3 py-1.5 rounded-lg shadow hover:to-orange-600 hover:from-orange-1000 transition-all text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-300 cursor-pointer w-full mb-3">
              <span className="flex justify-center items-center gap-2 w-full">
                <ArrowCounterClockwise size={18} className="text-white" />
                Recomeçar
              </span>
            </button>
          </div>
        )}
        <div
          ref={chatRef}
          className="flex-1 overflow-y-auto mb-6 space-y-6 pr-2">
          {historico.length === 0 && (
            <div>
              <div className="flex justify-center items-center">
                <div className="bg-gradient-to-r from-orange-1000 to-orange-600 rounded-full w-20 h-20 flex items-center justify-center">
                  <Brain size={50} className="text-white" />
                </div>
              </div>

              <div className="text-center text-black font-bold text-3xl mt-2">
                Em que podemos te ajudar hoje?
              </div>

              <div className="mt-10">
                {mensagensAjuda.map((message: string, index: number) => {
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        enviarMensagemDefinida(message)
                      }}
                      className="text-center text-gray-600 cursor-pointer hover:bg-gray-300 p-2 font-extralight mt-4 bg-gray-200 rounded-md">
                      <p>{message}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          {historico.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-3 ${
                msg.autor === 'user' ? 'justify-end' : 'justify-start'
              }`}>
              {msg.autor === 'gpt' && (
                <div className="flex-shrink-0 flex items-center justify-center">
                  <div className="bg-orange-1000 rounded-full w-9 h-9 flex items-center justify-center">
                    <Brain size={28} className="text-white" />
                  </div>
                </div>
              )}
              <div
                className={`rounded-lg px-4 py-2 max-w-[80%] text-sm shadow-sm ${
                  msg.autor === 'user'
                    ? 'bg-orange-1000 text-white self-end'
                    : 'bg-gray-100 text-gray-800 self-start'
                }`}>
                {msg.texto}
              </div>
              {msg.autor === 'user' && (
                <div className="flex-shrink-0 flex items-center justify-center">
                  <div className="bg-gray-300 rounded-full w-9 h-9 flex items-center justify-center">
                    <UserCircle size={28} className="text-orange-1000" />
                  </div>
                </div>
              )}
            </div>
          ))}
          {carregando && (
            <div className="flex justify-start">
              <div className="rounded-lg px-4 py-2 max-w-[80%] text-sm shadow-sm bg-gray-100 text-gray-800 self-start animate-pulse">
                Kauane está digitando...
              </div>
            </div>
          )}
        </div>
        <div>
          <InputComponent
            id="mensagem"
            placeholder="Pergunte alguma coisa"
            value={mensagem}
            icon={<ChatsCircle size={20} />}
            iconLeft={
              <span
                onClick={enviarMensagem}
                data-tip="Enviar"
                className="tooltip tooltip-top">
                <PaperPlaneTilt
                  size={30}
                  className="bg-gradient-to-r from-orange-1000 to-orange-600 rounded-full text-white p-1 hover:scale-110 active:scale-95 hover:shadow-orange-1000 cursor-pointer
                 active:bg-orange-700 font-bold shadow hover:bg-orange-1000 hover:bg-gradient-to-r hover:to-orange-600 hover:from-orange-1000 hover:text-white transition-all duration-700"
                />
              </span>
            }
            onChange={(e) => setMensagem(e.target.value)}
            className="resize-none w-full border-none focus:outline-none focus:ring-0 shadow-none bg-gray-100"
            disabled={carregando}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                enviarMensagem()
              }
            }}
          />
        </div>
      </div>
    </BaseLayout>
  )
}
