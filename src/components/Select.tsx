import { SelectInterface } from '@/Interfaces/SelectInterface'
import React from 'react'

export default function Select({
  icon,
  iconRight,
  iconRightFuntion,
  textLabel,
  textError,
  error,
  onClickButton,
  buttonRight,
  styleLabel,
  requiredItem = false,
  options,
  ...props
}: SelectInterface) {
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
            }`}
          >
            {icon}
          </span>
        )}

        <div>
          <select
            {...props}
            className={`${icon ? 'px-11' : 'px-5'} ${
              error
                ? 'bg-red-400 border border-red-600 placeholder:text-red-600 focus:outline-red-500'
                : 'bg-white border border-gray-300 placeholder:text-gray-300 focus:bg-gray-100 focus:outline-blue-1000'
            } rounded-md w-full h-12 text-black focus:border-none appearance-none ${
              props.className ?? ''
            }`}
          >
            <option value="">Selecione uma opção</option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

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

        {iconRight && (
          <span
            onClick={iconRightFuntion}
            className="absolute top-1 text-center right-2 flex items-center text-gray-400 cursor-pointer hover:bg-gray-100 p-2 rounded-full active:scale-90 duration-300"
          >
            {iconRight}
          </span>
        )}
      </div>
    </div>
  )
}
