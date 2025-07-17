import { FeaturesConsultaType } from '@/types/FeaturesType'
import {
  ArrowRight,
  Clock,
  Lightbulb,
  PencilSimple,
  User,
  X
} from '@phosphor-icons/react'
import React from 'react'
import { Button, ButtonIcon } from './Button'
import { useRouter } from 'next/navigation'
import { CLickLabel } from '@/services/clickLabel'
import { useDispatch } from 'react-redux'
import { setFeature } from '@/redux/feature/actions'

export default function CardFeature({
  fotosFeatures,
  ftcodigo,
  ftdescricao,
  ftquando,
  fttitulo,
  usuario,
  completa = false,
  listagem = false
}: FeaturesConsultaType) {
  const router = useRouter()
  const dispatch = useDispatch()

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

      <div className="md:flex md:justify-center md:items-center md:gap-2 mt-2 text-xs text-gray-500">
        <div className="truncate flex justify-center items-center gap-2">
          <Clock size={24} />
          {ftquando}
        </div>

        <div className="md:flex hidden">-</div>

        <div className="font-semibold text-gray-700 truncate  md:mt-0 mt-2 flex justify-center items-center gap-2">
          <User size={24} />
          {usuario.usnome}
        </div>
      </div>

      {/* Botão acessar */}
      {!listagem && !completa && (
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

      {listagem && (
        <div className="flex justify-center items-center gap-2 mt-5">
          <div className="w-full tooltip tooltip-bottom" data-tip="Editar">
            <ButtonIcon
              className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-all duration-300 transform w-full"
              icon={<PencilSimple size={20} />}
              onClick={() => {
                dispatch(
                  setFeature({
                    fotosFeatures,
                    ftcodigo,
                    ftdescricao,
                    ftquando,
                    fttitulo,
                    usuario,
                    completa,
                    listagem
                  })
                )

                router.push('/features/cadastro')
              }}
            />
          </div>

          <div className="w-full tooltip tooltip-bottom" data-tip="Deletar">
            <ButtonIcon
              onClick={() => {
                dispatch(
                  setFeature({
                    fotosFeatures,
                    ftcodigo,
                    ftdescricao,
                    ftquando,
                    fttitulo,
                    usuario,
                    completa,
                    listagem
                  })
                )
                CLickLabel('modalConfirmarDeletarFeature')
              }}
              className="w-full p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-full transition-all duration-300 transform"
              icon={<X size={20} />}
            />
          </div>
        </div>
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
