import { CategoriasProblemasType } from './CategoriasProblemasType';
import { EnderecosType } from './EnderecosType';
import { FotosProblemasType } from './FotosProblemasType';

export type ProblemasType = {
  decodigo?: string;
  decategoria: string;
  dedescricao: string;
  deusuario?: string;
  delocalizacao: string;
  dedata: string;
  destatus?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ProblemasCriateType = {
  decodigo?: string;
  decategoria?: string;
  dedescricao?: string;
  deusuario?: string;
  endereco: EnderecosType;
  fotos: Array<string>;
  problemas: ProblemasType;
};

export type CancelarProblemaType = {
  decodigo: string;
};

export type FindProblemaType = {
  decodigo: string;
};

export type AtualizarStatusRelatoType = {
  decodigo: string;
  destatus: StatusProblemasEnumType;
};

export type StatusProblemasEnumType =
  | 'EM_ANALISE'
  | 'RESOLVIDO'
  | 'PENDENTE'
  | 'EM_ANDAMENTO'
  | 'CORRIGIR';

export type ProvasProblemaType = {
  fotos: Array<string>;
}

export type ConsultaProblemasLocalizacaoUsuarioType = {
  uscodigo: any;
}

export type RegistrarProblemaType = ProblemasType & EnderecosType & ProvasProblemaType;

export type ProblemaLocalizacaoType = {
  decodigo: string;
  decategoria: string;
  dedescricao: string;
  delocalizacao: string;
  deusuario: string;
  dedata: string;
  destatus: string;
  localizacao: EnderecosType;
  categoria: CategoriasProblemasType;
  FotosProblemas: Array<FotosProblemasType>;
  HistoricoCorrecoesProblemas?: Array<HistoricoCorrecoesProblemasType>;
  createdAt?: string;
}

export type HistoricoCorrecoesProblemasType = {
  hcpcodigo: string;
  hcpmotivo: string;
  hcpproblema: string;
  hcpquando: string;
};

export type AprovarReprovarProblemaType = {
  decodigo: string;
  status: boolean;
  motivo: string;
  quando: string;
};
