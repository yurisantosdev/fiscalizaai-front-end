import Modal from '@/components/Modal'
import { ModalLegendaCategoriasInterface } from '@/Interfaces/ModalLegendaCategoriasInterface'
import { SelectValuesType } from '@/types/GeneralTypes'
import React from 'react'

export default function ModalLegendaCategorias({
  categorias
}: ModalLegendaCategoriasInterface) {
  return (
    <Modal
      htmlFor="modalLegendaCategorias"
      name="Legenda de Categorias"
      loading={false}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {categorias.map((categoria: SelectValuesType, index: number) => {
          return (
            <div
              key={index}
              className="border border-gray-400 p-4 rounded-lg hover:border-primary-500 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] bg-gray-1100 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative z-10">
                <p className="text-lg font-bold text-center text-primary-500 group-hover:text-primary-400 transition-colors">
                  {categoria.label}
                </p>

                <div className="w-16 h-1 bg-primary-500 mx-auto my-3 rounded-full group-hover:bg-primary-400 transition-colors"></div>

                <p className="text-sm text-gray-300 mt-2 text-center group-hover:text-gray-200 transition-colors">
                  {categoria.description}
                </p>
              </div>

              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-primary-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </div>
          )
        })}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a1a1a;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3b3b3b;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4b4b4b;
        }
      `}</style>
    </Modal>
  )
}
