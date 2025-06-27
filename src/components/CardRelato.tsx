import { CardRelatoInterface } from '@/Interfaces/CardRelatoInterface'
import { FotosProblemasType } from '@/types/FotosProblemasType'
import {
  Calendar,
  CheckCircle,
  Clock,
  MagnifyingGlass,
  MapPin,
  SealQuestion,
  SquaresFour,
  WarningCircle,
  Image as ImageIcon,
  Check,
  X,
  ChatTeardropText,
  PencilCircle,
  ClockCounterClockwise
} from '@phosphor-icons/react'
import React, { JSX } from 'react'
import { Button } from './Button'
import { FormatarDataBrasileira } from '@/services/formatters'
import { UsuarioConsultaType } from '@/types/UsuariosType'
import { useSelector } from 'react-redux'
import { HistoricoRelatosType } from '@/types/ProblemasType'

export default function CardRelato({
  problema,
  onCLickAprovar,
  onCLickReprovar,
  aprovarReprovarButtons = false,
  inputMotivo,
  resumido = false,
  onClickAjustarRelato,
  onClickCancelarRelato,
  buttonsAjustarCancelar = true,
  mostrarFotos = true,
  onClickProximaEtapaRelato,
  onClickConcluirRelato,
  botoesProximaEtapaConcluir = false,
  historicoRelato = false,
  ordem,
  ...props
}: CardRelatoInterface) {
  const statusColors: Record<string, string> = {
    PENDENTE: 'bg-yellow-100 text-yellow-800',
    EM_ANALISE: 'bg-blue-100 text-blue-800',
    RESOLVIDO: 'bg-green-100 text-green-800',
    EM_ANDAMENTO: 'bg-orange-100 text-orange-800',
    CORRIGIR: 'bg-red-100 text-red-800'
  }
  const statusIcons: Record<string, JSX.Element> = {
    PENDENTE: <WarningCircle size={20} weight="fill" />,
    EM_ANALISE: <MagnifyingGlass size={20} weight="fill" />,
    RESOLVIDO: <CheckCircle size={20} weight="fill" />,
    EM_ANDAMENTO: <Clock size={20} weight="fill" />,
    CORRIGIR: <SealQuestion size={20} weight="fill" />
  }
  const user: UsuarioConsultaType = useSelector(
    (state: any) => state.userReducer
  )

  return (
    <>
      <div
        {...props}
        className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 mb-5 ${
          props.className ?? ''
        }`}>
        <div className="p-6">
          {ordem && (
            <div className="relative top-0 left-0 w-6 mb-3 h-6 flex justify-center items-center text-center text-sn rounded-full bg-gray-100 p-2">
              <p className="text-gray-400 text-xs">{ordem}</p>
            </div>
          )}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="md:flex md:items-center md:space-x-3 md:w-[80%] w-full">
              {!resumido && (
                <div className="md:flex hidden p-3 bg-blue-100 rounded-lg">
                  <SquaresFour
                    size={28}
                    className="text-blue-800"
                    weight="fill"
                  />
                </div>
              )}

              <div>
                <h3 className="md:text-xl text-lg md:text-start text-center font-semibold text-gray-800 md:mb-0 mb-2">
                  {problema.categoria.cacategoria}
                </h3>

                {!resumido && (
                  <p className="text-sm text-gray-500">
                    {problema.categoria.cadescricao}
                  </p>
                )}
              </div>
            </div>

            <div
              className={`p-2 md:w-[20%] w-full m-auto rounded-full flex items-center space-x-2 justify-center ${
                statusColors[problema.destatus]
              } self-start md:self-center`}>
              {statusIcons[problema.destatus]}

              <span className="text-sm font-medium">
                {problema.destatus == 'EM_ANALISE' && 'Em Análise'}

                {problema.destatus == 'PENDENTE' && 'Pendente'}

                {problema.destatus == 'RESOLVIDO' && 'Resolvido'}

                {problema.destatus == 'EM_ANDAMENTO' && 'Em Andamento'}

                {problema.destatus == 'CORRIGIR' && 'Corrigir'}
              </span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-3 text-gray-600 bg-gray-50 p-3 rounded-md">
              <ChatTeardropText
                size={24}
                weight="fill"
                className="text-orange-1000"
              />
              <div>
                <p className="text-sm font-bold text-gray-500">Descrição</p>
                <p className="text-sm">{problema.dedescricao}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 text-gray-600 bg-gray-50 p-3 rounded-md">
              <MapPin size={24} weight="fill" className="text-orange-1000" />
              <div>
                <p className="text-sm font-bold text-gray-500">Localização</p>
                <p className="text-sm">
                  {problema.localizacao.edrua}, {problema.localizacao.ednumero}
                  {problema.localizacao.edcomplemento &&
                    ` - ${problema.localizacao.edcomplemento}`}
                </p>
                <p className="text-sm">
                  {problema.localizacao.edbairro},{' '}
                  {problema.localizacao.municipio &&
                    problema.localizacao.municipio.mcmunicipio}{' '}
                  -{' '}
                  {problema.localizacao.estado &&
                    problema.localizacao.estado.esestado}
                </p>

                <div className="flex justify-start items-center gap-2 mt-2">
                  <p className="text-sm font-semibold">Ponto de referência:</p>
                  <p className="text-sm">
                    {problema.localizacao &&
                      problema.localizacao.edpontoreferencia}
                  </p>
                </div>
                {problema.localizacao.edlatitude &&
                  problema.localizacao.edlongitude && (
                    <Button
                      title="Ver no mapa"
                      onClick={() => {
                        const url = `https://www.google.com/maps?q=${problema.localizacao.edlatitude},${problema.localizacao.edlongitude}`
                        window.open(url, '_blank')
                      }}
                      iconLeft={<MapPin size={16} />}
                      className="mt-2 bg-orange-1000 hover:bg-orange-1000/80 active:bg-orange-1000 text-white px-3 py-1 rounded-lg transition-colors duration-300 shadow-sm hover:shadow-md flex items-center gap-1 text-xs"
                    />
                  )}
              </div>
            </div>

            <div className="flex items-center space-x-3 text-gray-600 bg-gray-50 p-3 rounded-md">
              <Calendar size={24} weight="fill" className="text-orange-1000" />
              <div>
                <p className="text-sm font-bold text-gray-500">
                  Data do Relato
                </p>
                <p className="text-sm">
                  {FormatarDataBrasileira(problema.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {mostrarFotos &&
            problema.FotosProblemas &&
            problema.FotosProblemas.length > 0 && (
              <div className="mt-4 bg-gray-50 p-3 rounded-md max-h-[150px]">
                <div className="flex items-center space-x-2 mb-3">
                  <ImageIcon
                    size={24}
                    weight="fill"
                    className="text-orange-1000"
                  />
                  <p className="text-sm font-bold text-gray-500">
                    Fotos do Problema
                  </p>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {problema.FotosProblemas.map(
                    (foto: FotosProblemasType, fotoIndex: number) => (
                      <div
                        key={fotoIndex}
                        className="w-[90px] h-[90px] relative aspect-square rounded-md overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300">
                        <img
                          src={`data:image/jpeg;base64,${foto.fdfoto}`}
                          alt={`Foto do problema ${fotoIndex + 1}`}
                          className="w-[90px] h-[90px] object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

          {problema.destatus == 'CORRIGIR' ||
          problema.destatus == 'EM_ANALISE' ? (
            <div>
              {problema.HistoricoCorrecoesProblemas &&
                problema.HistoricoCorrecoesProblemas.length > 0 && (
                  <div className="bg-red-100 rounded-lg mb-4 mt-4">
                    <div className="flex items-center space-x-3 text-gray-600 bg-red-100 p-3 rounded-md">
                      <ChatTeardropText
                        size={24}
                        weight="fill"
                        className="text-orange-1000"
                      />
                      <div>
                        <p className="text-sm font-bold text-gray-500">
                          Motivo para correção
                        </p>
                        <p className="text-sm">
                          {problema.HistoricoCorrecoesProblemas.length > 0 &&
                            problema.HistoricoCorrecoesProblemas[0].hcpmotivo}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              {buttonsAjustarCancelar && (
                <div className="flex justify-center items-center gap-2">
                  <div className="w-full m-auto mt-5">
                    <Button
                      title="Revisar"
                      onClick={onClickAjustarRelato}
                      iconLeft={<PencilCircle size={20} />}
                      className="w-full m-auto bg-blue-1000 hover:bg-blue-1000/80 active:bg-blue-1000 text-white px-4 py-2 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                    />
                  </div>

                  <div className="w-full m-auto mt-5">
                    <Button
                      title="Cancelar"
                      onClick={onClickCancelarRelato}
                      iconLeft={<X size={20} />}
                      className="w-full m-auto bg-red-700 hover:bg-red-700/80 active:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                    />
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {aprovarReprovarButtons && (
            <div>
              {inputMotivo}
              <div className="mt-10 flex justify-center items-center gap-2">
                <Button
                  title="Reprovar"
                  className="bg-red-800 hover:bg-red-800/80 active:bg-red-800 text-white px-4 py-2 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg flex items-center gap-2 w-full"
                  iconLeft={<X size={20} />}
                  onClick={onCLickReprovar}
                />

                <Button
                  title="Aprovar"
                  className="bg-green-800 hover:bg-green-800/80 active:bg-green-800 text-white px-4 py-2 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg flex items-center gap-2 w-full"
                  iconLeft={<Check size={20} />}
                  onClick={onCLickAprovar}
                />
              </div>
            </div>
          )}

          {botoesProximaEtapaConcluir && (
            <span>
              {problema.destatus == 'PENDENTE' && user.usmaster && (
                <div className="mt-10 flex justify-center items-center gap-2">
                  <Button
                    title="Próxima etapa"
                    className="bg-blue-1000 hover:bg-blue-1000/80 active:bg-blue-1000 text-white px-4 py-2 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg flex items-center gap-2 w-full truncate"
                    onClick={onClickProximaEtapaRelato}
                  />
                  <Button
                    title="Concluir"
                    className="bg-green-800 hover:bg-green-800/80 active:bg-green-800 text-white px-4 py-2 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg flex items-center gap-2 w-full"
                    onClick={onClickConcluirRelato}
                  />
                </div>
              )}

              {problema.destatus == 'EM_ANDAMENTO' && user.usmaster && (
                <div className="mt-10 flex justify-center items-center gap-2">
                  <Button
                    title="Concluir"
                    className="bg-green-800 hover:bg-green-800/80 active:bg-green-800 text-white px-4 py-2 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg flex items-center gap-2 w-full"
                    onClick={onClickConcluirRelato}
                  />
                </div>
              )}
            </span>
          )}

          {historicoRelato && (
            <div className="mt-4 bg-gray-50 rounded-md p-2">
              {problema.HistoricoRelatos &&
              problema.HistoricoRelatos?.length > 0 ? (
                <div className="mb-3">
                  <div className="flex justify-center items-center gpa-3">
                    <ClockCounterClockwise
                      size={24}
                      weight="fill"
                      className="text-orange-1000"
                    />
                    <p className="text-center text-sm text-black font-bold">
                      Histórico sobre o Relato
                    </p>
                  </div>
                  {problema.HistoricoRelatos.map(
                    (historico: HistoricoRelatosType, index: number) => {
                      return (
                        <div
                          key={index}
                          className="bg-blue-100 p-2 rounded-md mt-2">
                          <p className="text-black text-center">
                            {historico.hrtratativa}
                          </p>
                        </div>
                      )
                    }
                  )}
                </div>
              ) : (
                <p className="text-center text-black text-sm italic font-extralight">
                  Sem histórico registrado
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
