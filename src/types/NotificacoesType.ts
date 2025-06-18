export type NotificacoesType = {
  ntcodigo?: string;
  ntlida: boolean;
  ntusuario: string;
  ntnotificacao: string;
  createdAt: string;
  updatedAt?: string;
};

export type NotificacoesSimplesConsultaType = {
  todas: Array<NotificacoesType>;
  naoLidas: Array<NotificacoesType>;
};

export type NotificacoesConsultaType = {
  uscodigo: string;
};