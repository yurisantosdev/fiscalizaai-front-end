import {
  X,
  User,
  Envelope,
  MapPin,
  Shield,
  Calendar
} from '@phosphor-icons/react'
import React from 'react'
import { useSelector } from 'react-redux'
import { UsuarioConsultaType } from '@/types/UsuariosType'

export default function AbaPerfil() {
  const user: UsuarioConsultaType = useSelector(
    (state: any) => state.userReducer
  )

  return (
    <div className="drawer z-[9999999]">
      <input id="abaLateralPerfil" type="checkbox" className="drawer-toggle" />

      <div className="drawer-side z-50">
        <label
          htmlFor="abaLateralPerfil"
          aria-label="close sidebar"
          className="drawer-overlay"></label>
        <div className="bg-gradient-to-b from-gray-1200 to-gray-1100 p-3 h-screen rounded-r-md md:w-[50%] w-[80%] pt-4">
          <div className="relative">
            <h1 className="text-white text-lg font-bold text-center">
              Perfil do Usuário
            </h1>

            <label
              className="absolute -top-2 right-1 cursor-pointer hover:bg-white/80 p-1 rounded-full text-white hover:text-black transition-all duration-300"
              htmlFor="abaLateralPerfil">
              <X size={20} />
            </label>
          </div>

          <div className="mt-6">
            {/* Avatar e Nome */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-orange-1000 to-orange-900 flex items-center justify-center mb-4">
                <User size={40} className="text-white" />
              </div>
              <h2 className="text-white text-xl font-bold">{user.usnome}</h2>
              <p className="text-gray-400 text-sm">
                {user.usmaster ? 'Administrador' : 'Usuário'}
              </p>
            </div>

            {/* Informações do Usuário */}
            <div className="bg-gray-1100/50 backdrop-blur-sm p-4 rounded-xl shadow-lg">
              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-1000/20 p-2 rounded-lg">
                    <Envelope size={24} className="text-orange-1000" />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Email</label>
                    <p className="text-white font-medium truncate max-w-[90%]">
                      {user.usemail}
                    </p>
                  </div>
                </div>

                {/* Endereço */}
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-1000/20 p-2 rounded-lg">
                    <MapPin size={24} className="text-orange-1000" />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Endereço</label>
                    <div className="flex flex-wrap justify-start items-center gap-2 break-words max-w-[180px]">
                      <span className="text-white font-medium break-words">
                        {user.endereco.edbairro},
                      </span>

                      <span className="text-white font-medium break-words">
                        {user.endereco.municipio.mcmunicipio} -
                      </span>

                      <span className="text-white font-medium break-words">
                        {user.endereco.estado.essigla}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tipo de Usuário */}
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-1000/20 p-2 rounded-lg">
                    <Shield size={24} className="text-orange-1000" />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">
                      Nível de Acesso
                    </label>
                    <p className="text-white font-medium">
                      {user.usmaster ? 'Administrador' : 'Usuário Comum'}
                    </p>
                  </div>
                </div>

                {/* Data de Criação */}
                {user.createdAt && (
                  <div className="flex items-start space-x-4">
                    <div className="bg-orange-1000/20 p-2 rounded-lg">
                      <Calendar size={24} className="text-orange-1000" />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">
                        Membro desde
                      </label>
                      <p className="text-white font-medium">
                        {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
