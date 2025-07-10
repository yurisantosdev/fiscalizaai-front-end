'use client'
import React, { useState, useRef, useEffect } from 'react'
import BaseLayout from '@/templates/BaseLayout'
import { enviarMensagemKauane } from '@/services/kauane'
import {
  UserCircle,
  Brain,
  PaperPlaneTilt,
  ChatsCircle
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
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [historico])

  async function enviarMensagem(e?: React.FormEvent) {
    if (e) e.preventDefault()
    if (!mensagem.trim()) return
    const msg = mensagem
    setHistorico((h) => [...h, { autor: 'user', texto: msg }])
    setMensagem('')
    setCarregando(true)
    try {
      const data = await enviarMensagemKauane(msg)
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
        <div
          ref={chatRef}
          className="flex-1 overflow-y-auto mb-6 space-y-6 pr-2">
          {historico.length === 0 && (
            <div className="text-center text-black font-bold text-3xl mt-10">
              Em que podemos te ajudar hoje?
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
              <span onClick={enviarMensagem}>
                <PaperPlaneTilt
                  size={30}
                  className="bg-orange-1000 rounded-full text-white p-1 hover:scale-110 active:scale-95 duration-300 hover:shadow-orange-1000 cursor-pointer"
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
