import React from 'react'
import { TextareaInterface } from '@/Interfaces/TextareaInterface'

export default function Textarea({
  icon,
  textLabel,
  textError,
  error,
  onClickButton,
  buttonRight,
  styleLabel,
  requiredItem = false,
  ...props
}: TextareaInterface) {
  return (
    <div className="relative">
      {textLabel && (
        <label className={`block font-bold ${styleLabel ?? ''}`}>
          {textLabel}

          {requiredItem && <span className="text-red-700 ml-1">*</span>}
        </label>
      )}

      <div className="relative mb-5 mt-1">
        {icon && (
          <span
            className={`absolute top-3 left-0 pl-3 flex items-center ${
              error ? 'text-red-600' : 'text-gray-400'
            }`}
          >
            {icon}
          </span>
        )}

        <div>
          <textarea
            {...props}
            rows={4}
            className={`${icon ? 'px-11' : 'px-5'} py-2 resize-none ${
              error
                ? 'bg-red-400 border border-red-600 placeholder:text-red-600 focus:outline-red-500'
                : 'bg-white border border-gray-300 placeholder:text-gray-300 focus:bg-gray-100 focus:outline-blue-1000'
            }  rounded-md w-full text-black focus:border-none ${
              props.className ?? ''
            }`}
          />

          {buttonRight && (
            <div
              onClick={onClickButton}
              className={`absolute top-2 cursor-pointer mr-3 right-0 flex justify-center items-center rounded-full ${
                error
                  ? 'text-red-600 hover:bg-red-300'
                  : 'text-gray-400 hover:bg-gray-100'
              }`}
            >
              {buttonRight}
            </div>
          )}

          {textError && textError}
        </div>
      </div>
    </div>
  )
}
