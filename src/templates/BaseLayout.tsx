'use client'
import BaseApp from '@/components/BaseApp'
import React, { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from '@phosphor-icons/react'
import { useSelector } from 'react-redux'
import { BaseLayoutInterface } from '@/Interfaces/BaseLayoutInterface'

export default function BaseLayout({
  children,
  title,
  showBackButton = true,
  backButtonPath = '/',
  backButtonText = 'Voltar',
  extraHeaderContent,
  buttonVoltar = false,
  styleBase = true,
  menu = true,
  adicionarItens = true,
  extraComponentLeft,
  extraComponentRigth
}: BaseLayoutInterface) {
  const router = useRouter()
  const loading = useSelector((state: any) => state.loadingReducer.loading)

  return (
    <BaseApp
      loading={loading}
      styleBase={styleBase}
      menu={menu}
      adicionarItens={adicionarItens}>
      <div className="min-h-screen bg-gradient-to-b from-gray-200 to-gray-300 p-2">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-300">
            {/* Cabeçalho */}
            {buttonVoltar && (
              <div className="flex items-center justify-between mb-6">
                {showBackButton && (
                  <button
                    onClick={() => router.push(backButtonPath)}
                    className="flex items-center text-gray-600 hover:text-orange-1000 transition-colors duration-300 cursor-pointer">
                    <ArrowLeft size={24} />
                    <span className="ml-2">{backButtonText}</span>
                  </button>
                )}
                {extraHeaderContent}
              </div>
            )}

            {/* Título */}
            <div className="flex justify-center items-center mb-6">
              <div className="w-[20%] flex justify-start items-center">
                {extraComponentLeft}
              </div>

              <div className="w-[70%] flex justify-center items-center">
                <h1 className="text-2xl font-bold text-gray-700 text-center">
                  {title}
                </h1>
              </div>

              <div className="w-[20%] flex justify-end items-center">
                {extraComponentRigth}
              </div>
            </div>

            {/* Conteúdo */}
            <div className="space-y-6">{children}</div>
          </div>
        </div>
      </div>
    </BaseApp>
  )
}
