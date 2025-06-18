import React from 'react'
import { X } from '@phosphor-icons/react'
import { ModalInterface } from '@/Interfaces/ModalInterface'
import Loading from './Loading'

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
        <div className="modal-box bg-white w-11/12 max-w-3xl max-h-[90vh] overflow-y-auto">
          {loading && <Loading />}

          <h3 className="text-lg font-bold text-center text-black">{name}</h3>

          <label
            htmlFor={htmlFor}
            className="absolute right-2 top-3 w-6 h-6 flex justify-center items-center cursor-pointer hover:bg-gray-1100 group p-1 rounded-full active:scale-95 duration-200"
          >
            <X size={50} className="text-black group-hover:text-white" />
          </label>

          <div className="p-2 mt-4">{children}</div>
        </div>
      </div>
    </div>
  )
}
