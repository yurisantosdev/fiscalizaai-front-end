import React from 'react'
import { X } from '@phosphor-icons/react'
import { ModalInterface } from '@/Interfaces/ModalInterface'

export default function Modal({
  name,
  htmlFor,
  children,
  loading,
  ...props
}: ModalInterface) {
  return (
    <div {...props}>
      <input type="checkbox" id={htmlFor} className="modal-toggle" />
      <div className="modal backdrop-blur-sm z-[99999]" role="dialog">
        <div
          className={`modal-box bg-white w-11/12 max-w-3xl max-h-[90vh] ${
            loading && 'overflow-hidden'
          }`}>
          {loading && (
            <div className="fixed top-0 left-0 w-full h-full bg-black/60 backdrop-blur-sm flex justify-center items-center z-[99999999]">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="animate-spin rounded-full h-24 w-24 border-4 border-orange-1000/30"></div>
                  <div className="animate-spin rounded-full h-24 w-24 border-4 border-t-orange-1000 border-r-orange-1000 absolute top-0 left-0"></div>
                </div>
                <p className="text-white text-lg font-medium">Carregando...</p>
              </div>
            </div>
          )}

          <h3 className="text-lg font-bold text-center text-black">{name}</h3>

          <label
            htmlFor={htmlFor}
            className="absolute right-2 top-3 w-6 h-6 flex justify-center items-center cursor-pointer hover:bg-gray-1100 group p-1 rounded-full active:scale-95 duration-200">
            <X size={50} className="text-black group-hover:text-white" />
          </label>

          <div className="p-2 mt-4">{children}</div>
        </div>
      </div>
    </div>
  )
}
