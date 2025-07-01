import {
  X,
  User,
  Envelope,
  MapPin,
  Shield,
  Calendar,
  LockKey,
  MapTrifold
} from '@phosphor-icons/react'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  TrocarEnderecoUsuarioType,
  UsuarioConsultaType
} from '@/types/UsuariosType'
import { Button } from '../Button'
import { CLickLabel } from '@/services/clickLabel'
import { resetEndereco, setEndereco } from '@/redux/endereco/actions'

export default function AbaPerfil() {
  const user: UsuarioConsultaType = useSelector(
    (state: any) => state.userReducer
  )
  const dispatch = useDispatch()

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

                {/* Botão troca de senha e endereço */}
                <div className="mt-14 md:flex md:justify-center md:items-center gap-2">
                  {/* Botão trocar senha */}
                  <div
                    className="tooltip tooltip-bottom w-full"
                    data-tip="Trocar de Senha">
                    <Button
                      title="Trocar senha"
                      onClick={() => {
                        CLickLabel('abaLateralPerfil')
                        CLickLabel('modalTrocarSenha')
                      }}
                      iconLeft={<LockKey size={20} />}
                      className="w-full m-auto bg-blue-1000 hover:bg-blue-1000/80 active:bg-blue-1000 text-white rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg flex items-center gap-2 p-3 truncate"
                    />
                  </div>

                  {/* Botão trocar de endereço */}
                  <div
                    className="tooltip tooltip-bottom w-full md:mt-0 mt-4"
                    data-tip="Troca de endereço">
                    <Button
                      iconLeft={<MapTrifold size={20} />}
                      onClick={() => {
                        const objEndereco: TrocarEnderecoUsuarioType = {
                          uscodigo: user.uscodigo,
                          ednumero: user.endereco.ednumero,
                          edbairro: user.endereco.edbairro,
                          edcep: user.endereco.edcep,
                          edcomplemento: user.endereco.edcomplemento,
                          edestado: user.endereco.edestado,
                          edmunicipio: user.endereco.edmunicipio,
                          edpontoreferencia: user.endereco.edpontoreferencia,
                          edrua: user.endereco.edrua,
                          edcodigo: user.endereco.edcodigo
                        }
                        dispatch(setEndereco(objEndereco))
                        CLickLabel('abaLateralPerfil')
                        CLickLabel('modalTrocarEndereco')
                      }}
                      title="Trocar endereço"
                      className="w-full m-auto bg-orange-1000 hover:bg-orange-1000/80 active:bg-orange-1000 text-white rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg flex items-center gap-2 p-3 truncate"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
