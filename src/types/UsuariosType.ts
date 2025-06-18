import { EnderecosType } from './EnderecosType';
import { EstadosType } from './EstadosType';
import { MunicipiosType } from './MunicipiosType';

export type UsuarioType = {
  uscodigo?: string;
  usnome: string;
  usemail: string;
  ussenha: string;
  usendereco?: string;
  usmaster?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type UsuarioConsultaType = {
  uscodigo: string;
  usemail: string;
  usnome: string;
  usendereco: string;
  usmaster: boolean;
  token: any;
  endereco: EnderecosUsuarioType;
  createdAt: string;
  localizacaoCasaUsuario: LocalizacaoCasaUsuarioType
};

export type LocalizacaoCasaUsuarioType = {
  latitude: number,
  longitude: number,
};

export type EnderecosUsuarioType = {
  edcodigo: string;
  edbairro: string;
  edcep: string;
  edcomplemento: string;
  edestado: string;
  edlatitude: string;
  edlongitude: string;
  edmunicipio: string;
  ednumero: string;
  edpontoreferencia: string;
  edproblema: string;
  edrua: string;
  municipio: MunicipiosType;
  estado: EstadosType;
};

export type UsuarioSimplesType = {
  uscodigo: string;
  usemail: string;
  usnome: string;
};

export type CriarUsuario = {
  usuario: UsuarioType;
  endereco: EnderecosType;
};

export type CriarUsuarioType = UsuarioType & EnderecosType & {
  confirmarSenha?: string;
};

export type EsqueciSenhaType = {
  email: string;
};

export type RedefinirSenhaType = {
  codigo: string
  novaSenha: string
  confirmarSenha: string
}
