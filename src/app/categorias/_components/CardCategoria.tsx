import { ButtonIcon } from '@/components/Button'
import { CardCategoriaType } from '@/types/CategoriasProblemasType'
import { Check, PencilSimple, SquaresFour, X } from '@phosphor-icons/react'
import React from 'react'

export default function CardCategoria({
  functionEditar,
  functionAtivarDesativar,
  categoria
}: CardCategoriaType) {
  return (
    <div className="bg-white rounded-lg shadow-sm transition-all duration-300 transform animate-slide-up">
      <div className="p-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 w-[100%]">
            <div className="p-2 bg-orange-100 rounded-lg">
              <SquaresFour
                size={24}
                weight="fill"
                className="text-orange-1000"
              />
            </div>
            <div className="w-[80%] h-[120px]">
              <div className="flex items-center justify-between gap-2">
                <div className="tooltip max-w-[80%]" data-tip={categoria.label}>
                  <h3 className="text-lg font-semibold text-gray-800 truncate">
                    {categoria.label}
                  </h3>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    categoria.caativa
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                  {categoria.caativa ? 'Ativa' : 'Inativa'}
                </span>
              </div>
              <div
                className="tooltip tooltip-bottom"
                data-tip={categoria.description}>
                <p className="text-sm text-gray-500 break-words line-clamp-4">
                  {categoria.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center gap-2">
          <div className="w-full tooltip tooltip-bottom" data-tip="Editar">
            <ButtonIcon
              onClick={functionEditar}
              className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-all duration-300 transform w-full"
              icon={<PencilSimple size={20} />}
            />
          </div>

          <div
            className="w-full tooltip tooltip-bottom"
            data-tip={categoria.caativa ? 'Desativar' : 'Ativar'}>
            <ButtonIcon
              onClick={functionAtivarDesativar}
              className={`w-full p-2 ${
                categoria.caativa
                  ? 'text-red-600 bg-red-50 hover:bg-red-100'
                  : 'text-green-600 bg-green-50 hover:bg-green-100'
              } rounded-full transition-all duration-300 transform`}
              icon={categoria.caativa ? <X size={20} /> : <Check size={20} />}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
