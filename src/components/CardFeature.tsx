import { FeaturesConsultaType } from '@/types/FeaturesType'
import { ArrowRight, Clock, Lightbulb, User } from '@phosphor-icons/react'
import React from 'react'
import { Button } from './Button'
import { useRouter } from 'next/navigation'
import { CLickLabel } from '@/services/clickLabel'

export default function CardFeature({
  fotosFeatures,
  ftcodigo,
  ftdescricao,
  ftquando,
  fttitulo,
  usuario,
  completa = false
}: FeaturesConsultaType) {
  const router = useRouter()

  return (
    <div className="bg-white mt-3 p-4 rounded-xl shadow-md hover:shadow-lg transition-all flex flex-col gap-2 border border-gray-200">
      <div className="flex justify-center items-center mb-2">
        <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mr-2">
          <Lightbulb size={40} />
        </span>
        <h1 className="text-lg font-bold text-blue-900 text-center flex-1">
          {fttitulo}
        </h1>
      </div>

      <p className="text-gray-700 text-md text-center px-2 mb-2">
        {ftdescricao}
      </p>

      <div className="flex justify-center items-center gap-2 mt-2 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Clock size={24} />
          {ftquando}
        </span>
        <span>-</span>
        <span className="font-semibold text-gray-700 flex items-center gap-1">
          <User size={24} />
          {usuario.usnome}
        </span>
      </div>

      {/* Botão acessar */}
      {!completa && (
        <Button
          title="Acessar"
          className="mt-3"
          iconRight={<ArrowRight size={20} />}
          onClick={() => {
            CLickLabel('modalAjudaUsuario')
            router.push(`feature/${ftcodigo}`)
          }}
        />
      )}

      {/* Imagens da feature, se completa, no final do card */}
      {completa &&
        fotosFeatures &&
        Array.isArray(fotosFeatures) &&
        fotosFeatures.length > 0 && (
          <div className="flex flex-col gap-4 mt-4">
            {fotosFeatures.map((foto, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <img
                  src={`data:image/jpeg;base64,${foto.fffoto}`}
                  alt={foto.ffdescricao || 'Imagem da feature'}
                  className="w-max object-cover"
                />
                {foto.ffdescricao && (
                  <span className="text-md text-gray-600 mt-2 text-center">
                    {foto.ffdescricao}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
    </div>
  )
}
