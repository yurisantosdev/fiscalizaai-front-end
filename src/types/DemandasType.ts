export type StatusDemandassEnumType = 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDO';

export type DemandasType = {
  dmcodigo?: string;
  dmtitle: string;
  dmregistrado: string;
  dmstatus: StatusDemandassEnumType;
  dmresponsavel: string;
  createdAt?: string;
  updatedAt?: string;
};

export type DemandasCreateType = {
  dmtitle: string;
  dmregistrado: string;
  dmresponsavel: string;
  rdrelato: string;
};

export type RelatosDemandasType = {
  rdcodigo: string;
  rddemanda: string;
  rdrelato: string;
  createdAt: string;
  updatedAt: string;
};
