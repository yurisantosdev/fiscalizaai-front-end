'use client'
import React, { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { BaseAppInterface } from '@/Interfaces/BaseAppInterface'
import BarraMenu from './BarraMenu/BarraMenu'
import AjudaUsuario from './AjudaUsuario'
import ModalTrocaSenha from './ModalTrocaSenha'
import ModalTrocaEndereco from './ModalTrocaEndereco'
import Feedbacks from './Feedbacks'
import ModalFeedbackUsuario from './ModalFeedbackUsuario'
import ModalAjudaUsuario from './ModalAjudaUsuario'

export default function BaseApp({
  children,
  loading,
  styleBase = true,
  ajudaUsuario = true,
  menu = true,
  feedbacks = true,
  extraComponentTitle
}: BaseAppInterface) {
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [loading])

  return (
    <div className="bg-gray-100 h-screen">
      <div
        className={`${
          styleBase && 'md:w-[65%] w-full md:m-auto bg-gray-100 p-2 '
        }`}>
        {ajudaUsuario && <AjudaUsuario />}
        {ajudaUsuario && <ModalAjudaUsuario />}
        {feedbacks && <Feedbacks />}
        {feedbacks && <ModalFeedbackUsuario />}
        {menu && <BarraMenu />}
        {extraComponentTitle && extraComponentTitle}
        {children}
      </div>

      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{ zIndex: 999999999999 }}
        toastOptions={{
          className: '',
          duration: 2000,
          removeDelay: 500,
          style: {
            background: '#232323',
            color: '#fff'
          },

          success: {
            duration: 1000,
            iconTheme: {
              primary: 'green',
              secondary: 'black'
            }
          }
        }}
      />

      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/60 backdrop-blur-xs flex justify-center items-center z-[99999999]">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-24 w-24 border-4 border-orange-1000/30"></div>
              <div className="animate-spin rounded-full h-24 w-24 border-4 border-t-orange-1000 border-r-orange-1000 absolute top-0 left-0"></div>
            </div>
            <p className="text-white text-lg font-medium">Carregando...</p>
          </div>
        </div>
      )}

      <ModalTrocaSenha />
      <ModalTrocaEndereco />
    </div>
  )
}
