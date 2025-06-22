import React, { useRef } from 'react'
import { InputInterface } from '@/Interfaces/InputInterface'
import { X } from '@phosphor-icons/react'

export default function Input({
  icon,
  textLabel,
  textError,
  error,
  onClickButton,
  buttonRight,
  styleLabel,
  fraseInputFile,
  removerFile,
  requiredItem = false,
  ...props
}: InputInterface) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const isFile = props.type === 'file'

  return (
    <div className="relative">
      {textLabel && (
        <label className={`block font-bold ${styleLabel ?? ''}`}>
          {textLabel}

          {requiredItem && <span className="text-red-700 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && (
          <span
            className={`absolute top-[12px] text-center left-0 pl-3 flex items-center ${
              error ? 'text-red-600' : 'text-gray-400'
            }`}>
            {icon}
          </span>
        )}

        <div>
          {isFile ? (
            <>
              <div>
                <button
                  type="button"
                  onClick={handleFileClick}
                  className={`${icon ? 'pl-10' : ''} ${
                    error
                      ? 'bg-red-400 border border-red-600 text-red-600 hover:bg-red-300'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                  } rounded-md w-full h-12 px-5 text-left cursor-pointer flex justify-between items-center mb-6`}>
                  <p className="w-[80%] truncate">{fraseInputFile}</p>
                </button>

                <div
                  onClick={removerFile}
                  className="text-red-600 hover:bg-red-100 rounded-full p-1 text-center absolute top-[10px] right-2 cursor-pointer">
                  <X size={20} />
                </div>
              </div>

              <input {...props} ref={fileInputRef} className="hidden" />
            </>
          ) : (
            <input
              {...props}
              className={`${icon ? 'px-11' : 'px-5'} ${
                error
                  ? 'bg-red-400 border border-red-600 placeholder:text-red-600 focus:outline-red-500'
                  : 'bg-white border border-gray-300 placeholder:text-gray-300 focus:bg-gray-100 focus:outline-blue-1000'
              }  rounded-md w-full h-12 text-black focus:border-none ${
                props.className ?? ''
              }`}
            />
          )}

          {buttonRight && (
            <div
              onClick={onClickButton}
              className={`absolute top-2 cursor-pointer mr-3 right-0 flex justify-center items-center rounded-full ${
                error
                  ? 'text-red-600 hover:bg-red-300'
                  : 'text-gray-400 hover:bg-gray-100'
              }`}>
              {buttonRight}
            </div>
          )}

          {textError && textError}
        </div>
      </div>
    </div>
  )
}
